import bcrypt from 'bcrypt'
import {pool} from '../config/db'

const BCRYPT_COST = 12;

export async function regiesterUser({ email, password}) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    const result = await pool.query(
        `INSERT INTO user (email, password)
        VALUES ($1, $2)
        RETURNING id, email, created_at`,
        [email, passwordHash]

    );
    return result.rows[0];
}