// ========================================
// src/routes/api/domains/list/+server.js
// Optional: untuk melihat daftar domain yang terdaftar
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const DOMAINS_FILE = path.join(process.cwd(), 'data', 'domains.json');

async function readDomains() {
	try {
		const data = await fs.readFile(DOMAINS_FILE, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		if (error.code === 'ENOENT') {
			return [];
		}
		throw error;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const domains = await readDomains();

		// Return only public information (hide sensitive data)
		const publicDomains = domains.map((d) => ({
			subdomain: d.subdomain,
			fullDomain: `${d.subdomain}.kotaukir.id`,
			status: d.status,
			createdAt: d.createdAt
		}));

		return json({
			success: true,
			total: publicDomains.length,
			domains: publicDomains
		});
	} catch (error) {
		console.error('Error listing domains:', error);
		return json({ error: 'Terjadi kesalahan server' }, { status: 500 });
	}
}
