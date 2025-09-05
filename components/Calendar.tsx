import React, { useState } from 'react';
import { Trip } from '../components/Interface';
import { TRIP_STATUS_LABELS } from './ReservationStatus';

type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

type CalendarProps = {
    selectedDate?: Date | [Date, Date];
    onDateChange?: (date: Date, id_trip: number) => void;
    reservations?: Trip[];
};

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const Calendar: React.FC<CalendarProps> = ({
    selectedDate,
    onDateChange,
    reservations,
}) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate
            ? Array.isArray(selectedDate)
                ? selectedDate[0].getMonth()
                : selectedDate.getMonth()
            : today.getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
        selectedDate
            ? Array.isArray(selectedDate)
                ? selectedDate[0].getFullYear()
                : selectedDate.getFullYear()
            : today.getFullYear()
    );

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Lundi = 0

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (id_trip: number | undefined, day: number) => {
        if (id_trip !== undefined) {
            // Find the reservation by id_trip and pass it to onDateChange or another callback
            const reservation = reservations?.find(res => res.id_trip === id_trip);
            if (reservation && onDateChange) {
                // Option 1: Pass the start_date of the reservation
                onDateChange(new Date(reservation.start_date), id_trip);
                return;
            }
        }
        // Fallback: pass the clicked date
        const date = new Date(currentYear, currentMonth, day);
        onDateChange?.(date, id_trip ?? -1);
    };

    const renderDays = () => {
        const days = [];
        // Responsive cell width using CSS clamp for better adaptability
        const cellWidth = 'clamp(40px, 12vw, 110px)';

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <td
                    key={`empty-${i}`}
                    style={{
                        height: 'clamp(40px, 10vw, 80px)',
                        background: '#f8f9fa',
                        minWidth: cellWidth,
                        width: cellWidth,
                    }}
                ></td>
            );
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isSelected =
                (Array.isArray(selectedDate) &&
                    selectedDate[0].toDateString() === date.toDateString()) ||
                (!Array.isArray(selectedDate) &&
                    selectedDate?.toDateString() === date.toDateString());

            const dayReservations = (reservations ?? []).filter(res => {
                const start = new Date(res.start_date);
                const end = new Date(res.end_date);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                return date >= start && date <= end;
            });

            const sortedReservations = [...dayReservations].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

            let className = 'calendar-day-box d-flex flex-column align-items-center justify-content-start border';
            if (isSelected) className += ' border-3 border-dark';

            days.push(
                <td
                    key={day}
                    style={{
                        padding: 0,
                        height: 'clamp(40px, 10vw, 80px)',
                        minWidth: cellWidth,
                        width: cellWidth,
                        position: 'relative',
                    }}
                >
                    <button
                        className={className}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                            fontWeight: isSelected ? 'bold' : 'normal',
                            fontSize: 'clamp(12px, 2vw, 22px)',
                            boxShadow: isSelected ? '0 0 0 2px #333' : undefined,
                            transition: 'box-shadow 0.2s',
                            background: isSelected ? '#e9ecef' : undefined,
                            position: 'relative',
                            paddingBottom: sortedReservations.length > 0 ? sortedReservations.length * 18 + 8 : undefined,
                        }}
                        tabIndex={0}
                    >
                        <span>{day}</span>
                        <div
                            style={{
                                marginTop: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 4,
                                pointerEvents: 'none',
                                width: '100%',
                                minHeight: sortedReservations.length * 18,
                            }}
                        >
                            {sortedReservations.map((res, idx) => {
                                const start = new Date(res.start_date);
                                const end = new Date(res.end_date);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                const status = res.reservation_status as ReservationStatus;

                                const reservationStart = start.getTime() < new Date(currentYear, currentMonth, 1).getTime()
                                    ? new Date(currentYear, currentMonth, 1)
                                    : start;
                                const reservationEnd = end.getTime() > new Date(currentYear, currentMonth + 1, 0).getTime()
                                    ? new Date(currentYear, currentMonth + 1, 0)
                                    : end;

                                if (date.getTime() < reservationStart.getTime() || date.getTime() > reservationEnd.getTime()) return null;

                                const weekDay = (date.getDay() + 6) % 7;
                                const daysLeftInRow = 7 - weekDay;
                                const daysLeftInMonth = daysInMonth - day + 1;
                                const daysLeftInReservation = Math.floor((reservationEnd.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                                let barDays = Math.min(daysLeftInRow, daysLeftInMonth, daysLeftInReservation);

                                if (date.getTime() === reservationStart.getTime() || weekDay === 0) {
                                    const info = `${res.vehicle.brand} ${res.vehicle.model} - (${res.agency_departure.city} → ${res.agency_arrival.city})`;
                                    return (
                                        <button
                                            key={res.id_trip ?? idx}
                                            style={{
                                                position: 'relative',
                                                width: `calc(${barDays} * ${cellWidth})`,
                                                height: 'clamp(12px, 2vw, 16px)',
                                                background: status === 'pending'
                                                    ? '#ffc107'
                                                    : status === 'confirmed'
                                                        ? '#0d6efd'
                                                        : '#198754',
                                                borderRadius: 8,
                                                zIndex: 10,
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingLeft: 8,
                                                paddingRight: 8,
                                                color: status === 'pending'
                                                    ? '#212529'
                                                    : '#fff',
                                                fontSize: 'clamp(10px, 1.5vw, 12px)',
                                                fontWeight: 500,
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                pointerEvents: 'auto',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                marginBottom: 2,
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            title={info}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDateClick(res.id_trip, day);
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                                                e.currentTarget.style.background = status === 'pending'
                                                    ? '#ffe066'
                                                    : status === 'confirmed'
                                                        ? '#2563eb'
                                                        : '#28a745';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                                e.currentTarget.style.background = status === 'pending'
                                                    ? '#ffc107'
                                                    : status === 'confirmed'
                                                        ? '#0d6efd'
                                                        : '#198754';
                                            }}
                                        >
                                            {info}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </button>
                </td>
            );
        }

        const rows = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
        }
        return rows;
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    return (
        <div className="container my-4" style={{ maxWidth: 800, width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <button className="btn btn-outline-secondary btn-lg" onClick={handlePrevMonth}>&lt;</button>
            <span className="fw-bold fs-2 text-center" style={{ flex: 1, minWidth: 180 }}>
                {monthNames[currentMonth]} {currentYear}
            </span>
            <button className="btn btn-outline-secondary btn-lg" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
                className="table table-bordered text-center"
                style={{
                tableLayout: 'fixed',
                fontSize: 'clamp(12px, 2vw, 18px)',
                minWidth: 560,
                width: '100%',
                maxWidth: '100%',
                }}
            >
                <thead>
                <tr>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Lun</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Mar</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Mer</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Jeu</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Ven</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Sam</th>
                    <th style={{ width: 'clamp(40px, 12vw, 110px)' }}>Dim</th>
                </tr>
                </thead>
                <tbody>{renderDays()}</tbody>
            </table>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-3">
            <span className="badge bg-warning text-dark px-3 py-2 fs-6">{TRIP_STATUS_LABELS['pending']}</span>
            <span className="badge bg-primary px-3 py-2 fs-6">{TRIP_STATUS_LABELS['confirmed']}</span>
            <span className="badge bg-success px-3 py-2 fs-6">{TRIP_STATUS_LABELS['completed']}</span>
            </div>
            <style jsx>{`
            .calendar-day-box {
                background: #fff;
                cursor: pointer;
                border-radius: 0;
                min-height: clamp(40px, 10vw, 80px);
                min-width: clamp(40px, 12vw, 110px);
                transition: background 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
            }
            .calendar-day-box:hover {
                background: #f1f3f4;
            }
            @media (max-width: 600px) {
                .calendar-day-box {
                min-width: 40px;
                min-height: 40px;
                font-size: 14px;
                }
                .fs-2 {
                font-size: 1.2rem !important;
                }
            }
            @media (max-width: 400px) {
                .calendar-day-box {
                min-width: 32px;
                min-height: 32px;
                font-size: 12px;
                }
            }
            `}</style>
        </div>
    );
};

export default Calendar;


