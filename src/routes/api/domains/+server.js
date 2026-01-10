// src/routes/api/domains/check/+server.js
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const DOMAINS_FILE = path.join(process.cwd(), 'data', 'domains.json');

// Ensure data directory exists
async function ensureDataDirectory() {
	const dataDir = path.join(process.cwd(), 'data');
	try {
		await fs.access(dataDir);
	} catch {
		await fs.mkdir(dataDir, { recursive: true });
	}
}

// Read domains from JSON file
async function readDomains() {
	try {
		await ensureDataDirectory();
		const data = await fs.readFile(DOMAINS_FILE, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		// If file doesn't exist, return empty array
		if (error.code === 'ENOENT') {
			return [];
		}
		throw error;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { subdomain } = await request.json();

		// Validation
		if (!subdomain || typeof subdomain !== 'string') {
			return json({ error: 'Subdomain tidak valid' }, { status: 400 });
		}

		const cleanSubdomain = subdomain.toLowerCase().trim();

		// Validate format
		const regex = /^[a-z0-9-]{3,30}$/;
		if (!regex.test(cleanSubdomain)) {
			return json(
				{
					error:
						'Format subdomain tidak valid. Gunakan huruf kecil, angka, dan strip (3-30 karakter)'
				},
				{ status: 400 }
			);
		}

		// Check if starts or ends with hyphen
		if (cleanSubdomain.startsWith('-') || cleanSubdomain.endsWith('-')) {
			return json(
				{ error: 'Subdomain tidak boleh diawali atau diakhiri dengan strip (-)' },
				{ status: 400 }
			);
		}

		// Read existing domains
		const domains = await readDomains();

		// Check availability
		const exists = domains.some((d) => d.subdomain === cleanSubdomain);

		if (exists) {
			return json({
				available: false,
				subdomain: cleanSubdomain,
				message: 'Subdomain sudah digunakan'
			});
		}

		return json({
			available: true,
			subdomain: cleanSubdomain,
			message: 'Subdomain tersedia'
		});
	} catch (error) {
		console.error('Error checking domain:', error);
		return json({ error: 'Terjadi kesalahan server' }, { status: 500 });
	}
}
