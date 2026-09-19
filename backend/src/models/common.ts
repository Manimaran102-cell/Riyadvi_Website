
export const STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const;
export type Status = (typeof STATUSES)[number];

export const statusField = { type: String, enum: STATUSES, default: 'new', index: true } as const;

export const baseOptions = { timestamps: true, versionKey: false } as const;

