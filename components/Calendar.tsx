import React, { useState } from 'react';
import { Trip } from '../components/Interface';
import { TRIP_STATUS_LABELS } from './ReservationStatus';

type ReservationStatus = 'pending' | 'confirmed' | 'completed';

type CalendarProps = {
    selectedDate?: Date | [Date, Date];
    onDateChange?: (date: Date) => void;
    reservations?: Trip[];
};

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getReservationStatuses = (
    reservations: Trip[] | undefined,
    date: Date
): ReservationStatus[] => {
    if (!reservations) return [];
    const dateCopy = new Date(date);
    dateCopy.setHours(0, 0, 0, 0);
    return reservations
        .filter((res) => {
            const start = new Date(res.start_date);
            const end = new Date(res.end_date);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return dateCopy >= start && dateCopy <= end;
        })
        .map(res => res.reservation_status as ReservationStatus);
};

const statusClass: Record<ReservationStatus, string> = {
    pending: 'bg-warning text-dark',
    confirmed: 'bg-primary text-white',
    completed: 'bg-success text-white',
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

    const handleDateClick = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        onDateChange?.(date);
    };

    const renderDays = () => {
        const days = [];
        // Responsive cell width
        const getCellWidth = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth < 576) return 44;
                if (window.innerWidth < 768) return 60;
                if (window.innerWidth < 992) return 80;
            }
            return 110;
        };
        const cellWidth = getCellWidth();

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<td key={`empty-${i}`} style={{ height: 80, background: '#f8f9fa', minWidth: cellWidth }}></td>);
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
                <td key={day} style={{ padding: 0, height: 80, minWidth: cellWidth, position: 'relative' }}>
                    <button
                        className={className}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                            fontWeight: isSelected ? 'bold' : 'normal',
                            fontSize: cellWidth < 60 ? 14 : cellWidth < 80 ? 16 : 22,
                            boxShadow: isSelected ? '0 0 0 2px #333' : undefined,
                            transition: 'box-shadow 0.2s',
                            background: isSelected ? '#e9ecef' : undefined,
                            position: 'relative',
                            paddingBottom: sortedReservations.length > 0 ? sortedReservations.length * 18 + 8 : undefined,
                        }}
                        onClick={() => handleDateClick(day)}
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

                                const daySpan = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
                                const info = `${res.vehicle.brand} ${res.vehicle.model} - (${TRIP_STATUS_LABELS[status]})`;

                                const weekDay = (date.getDay() + 6) % 7;
                                const daysLeftInRow = 7 - weekDay;

                                if (date.getTime() < start.getTime() || date.getTime() > end.getTime()) return null;

                                let barDays = Math.min(daySpan - (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24), daysLeftInRow);
                                if (date.getTime() > start.getTime()) {
                                    barDays = Math.min((end.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) + 1, daysLeftInRow);
                                }

                                if (weekDay === 0 || date.getTime() === start.getTime()) {
                                    return (
                                        <div
                                            key={res.id_trip ?? idx}
                                            style={{
                                                position: 'relative',
                                                width: barDays * cellWidth,
                                                height: 16,
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
                                                fontSize: cellWidth < 60 ? 10 : 12,
                                                fontWeight: 500,
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                pointerEvents: 'none',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                marginBottom: 2,
                                            }}
                                            title={info}
                                        >
                                            {info}
                                        </div>
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
        <div className="container my-4" style={{ maxWidth: 800 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary btn-lg" onClick={handlePrevMonth}>&lt;</button>
                <span className="fw-bold fs-2">
                    {monthNames[currentMonth]} {currentYear}
                </span>
                <button className="btn btn-outline-secondary btn-lg" onClick={handleNextMonth}>&gt;</button>
            </div>
            <table className="table table-bordered text-center" style={{ tableLayout: 'fixed', fontSize: 18 }}>
                <thead>
                    <tr>
                        <th style={{ width: 80 }}>Lun</th>
                        <th style={{ width: 80 }}>Mar</th>
                        <th style={{ width: 80 }}>Mer</th>
                        <th style={{ width: 80 }}>Jeu</th>
                        <th style={{ width: 80 }}>Ven</th>
                        <th style={{ width: 80 }}>Sam</th>
                        <th style={{ width: 80 }}>Dim</th>
                    </tr>
                </thead>
                <tbody>{renderDays()}</tbody>
            </table>
            <div className="mt-3 d-flex gap-3">
                <span className="badge bg-warning text-dark px-3 py-2 fs-6">{TRIP_STATUS_LABELS['pending']}</span>
                <span className="badge bg-primary px-3 py-2 fs-6">{TRIP_STATUS_LABELS['confirmed']}</span>
                <span className="badge bg-success px-3 py-2 fs-6">{TRIP_STATUS_LABELS['completed']}</span>
            </div>
            <style jsx>{`
                .calendar-day-box {
                    background: #fff;
                    cursor: pointer;
                    border-radius: 0;
                    min-height: 80px;
                    min-width: 80px;
                    transition: background 0.2s;
                }
                .calendar-day-box:hover {
                    background: #f1f3f4;
                }
            `}</style>
        </div>
    );
};

export default Calendar;


