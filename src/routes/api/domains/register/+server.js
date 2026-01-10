// ========================================
// src/routes/api/domains/register/+server.js
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const DOMAINS_FILE = path.join(process.cwd(), 'data', 'domains.json');

async function ensureDataDirectory() {
	const dataDir = path.join(process.cwd(), 'data');
	try {
		await fs.access(dataDir);
	} catch {
		await fs.mkdir(dataDir, { recursive: true });
	}
}

async function readDomains() {
	try {
		await ensureDataDirectory();
		const data = await fs.readFile(DOMAINS_FILE, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		if (error.code === 'ENOENT') {
			return [];
		}
		throw error;
	}
}

async function writeDomains(domains) {
	await ensureDataDirectory();
	await fs.writeFile(DOMAINS_FILE, JSON.stringify(domains, null, 2), 'utf-8');
}

function validateEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

function validateWhatsApp(wa) {
	const cleanWa = wa.replace(/\D/g, '');
	return cleanWa.length >= 10 && cleanWa.length <= 15;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { subdomain, name, email, whatsapp } = await request.json();

		// Validation
		if (!subdomain || !name || !email || !whatsapp) {
			return json({ error: 'Semua field harus diisi' }, { status: 400 });
		}

		// Validate subdomain format
		const cleanSubdomain = subdomain.toLowerCase().trim();
		const subdomainRegex = /^[a-z0-9-]{3,30}$/;
		if (!subdomainRegex.test(cleanSubdomain)) {
			return json({ error: 'Format subdomain tidak valid' }, { status: 400 });
		}

		// Validate name
		if (name.trim().length < 3) {
			return json({ error: 'Nama minimal 3 karakter' }, { status: 400 });
		}

		// Validate email
		if (!validateEmail(email)) {
			return json({ error: 'Format email tidak valid' }, { status: 400 });
		}

		// Validate WhatsApp
		if (!validateWhatsApp(whatsapp)) {
			return json({ error: 'Format nomor WhatsApp tidak valid (10-15 digit)' }, { status: 400 });
		}

		// Read existing domains
		const domains = await readDomains();

		// Check if subdomain already exists
		const exists = domains.some((d) => d.subdomain === cleanSubdomain);
		if (exists) {
			return json({ error: 'Subdomain sudah terdaftar' }, { status: 409 });
		}

		// Check if email already registered
		const emailExists = domains.some((d) => d.email === email.toLowerCase());
		if (emailExists) {
			return json({ error: 'Email sudah terdaftar' }, { status: 409 });
		}

		// Create new domain entry
		const newDomain = {
			id: Date.now().toString(),
			subdomain: cleanSubdomain,
			name: name.trim(),
			email: email.toLowerCase().trim(),
			whatsapp: whatsapp.replace(/\D/g, ''),
			status: 'pending', // pending, active, suspended
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		// Add to domains array
		domains.push(newDomain);

		// Save to file
		await writeDomains(domains);

		return json(
			{
				success: true,
				message: 'Registrasi berhasil',
				data: {
					subdomain: newDomain.subdomain,
					fullDomain: `${newDomain.subdomain}.kotaukir.id`,
					id: newDomain.id
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error registering domain:', error);
		return json({ error: 'Terjadi kesalahan server' }, { status: 500 });
	}
}
