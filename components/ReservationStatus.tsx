export const TRIP_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

export const TRIP_STATUS_LABELS: Record<string, string> = {
    [TRIP_STATUS.PENDING]: "En attente de confirmation",
    [TRIP_STATUS.CONFIRMED]: "Confirmé",
    [TRIP_STATUS.IN_PROGRESS]: "En cours",
    [TRIP_STATUS.COMPLETED]: "Terminé",
    [TRIP_STATUS.CANCELLED]: "Annulé",
    [TRIP_STATUS.NO_SHOW]: "Non présenté"
};

// Utilisation :
const status = TRIP_STATUS.PENDING;
const label = TRIP_STATUS_LABELS[status]; // "En attente de confirmation"