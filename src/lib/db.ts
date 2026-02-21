import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'quotes.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
    if (!db) {
        // Ensure data directory exists
        const fs = require('fs');
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');

        // Create tables
        db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_id TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT,
        city TEXT,
        tentative_date TEXT,
        guest_count INTEGER DEFAULT 100,
        event_hours INTEGER DEFAULT 6,
        is_outside_guayaquil INTEGER DEFAULT 0,
        selected_items_json TEXT NOT NULL,
        total_estimated REAL DEFAULT 0,
        items_count INTEGER DEFAULT 0,
        quote_only_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        email_sent INTEGER DEFAULT 0,
        pdf_generated INTEGER DEFAULT 0
      );
    `);
    }
    return db;
}

export interface QuoteRecord {
    quoteId: string;
    fullName: string;
    email: string;
    whatsapp: string;
    city: string;
    tentativeDate: string;
    guestCount: number;
    eventHours: number;
    isOutsideGuayaquil: boolean;
    selectedItems: any[];
    totalEstimated: number;
    itemsCount: number;
    quoteOnlyCount: number;
}

export function saveQuote(record: QuoteRecord): void {
    const db = getDb();
    const stmt = db.prepare(`
    INSERT INTO quotes (
      quote_id, full_name, email, whatsapp, city, tentative_date,
      guest_count, event_hours, is_outside_guayaquil,
      selected_items_json, total_estimated, items_count, quote_only_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    stmt.run(
        record.quoteId,
        record.fullName,
        record.email,
        record.whatsapp,
        record.city,
        record.tentativeDate,
        record.guestCount,
        record.eventHours,
        record.isOutsideGuayaquil ? 1 : 0,
        JSON.stringify(record.selectedItems),
        record.totalEstimated,
        record.itemsCount,
        record.quoteOnlyCount
    );
}

export function markEmailSent(quoteId: string): void {
    const db = getDb();
    db.prepare('UPDATE quotes SET email_sent = 1 WHERE quote_id = ?').run(quoteId);
}

export function markPdfGenerated(quoteId: string): void {
    const db = getDb();
    db.prepare('UPDATE quotes SET pdf_generated = 1 WHERE quote_id = ?').run(quoteId);
}
