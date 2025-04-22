import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create the connection to MySQL
const db = await mysql.createConnection({
    host: 'localhost', // Or your DB host
    user: 'root', // Or your DB user
    password: '', // Or your DB password
    database: 'climate_action_app', // Database name
});

export async function POST(req: Request) {
    try {

        const body = await req.json();
        console.log(body);

        const [userResult] = await db.execute(`INSERT INTO Users () VALUES ()`);
        const userId = (userResult as mysql.ResultSetHeader).insertId;


        // 2. Insert submission
        const [submissionResult] = await db.execute(
            `INSERT INTO SurveySubmissions (user_id) VALUES (?)`,
            [userId]
        );
        const submissionId = (submissionResult as mysql.ResultSetHeader).insertId;

        const referredBy = body.referredBy;
        const otherReferralValue = body.otherReferralValue;
        

        // Loop through each key-value pair in the JSON object
        for (const [key, value] of Object.entries(body)) {
            if (key === 'referredBy' || key === 'otherReferralValue') {
                // Skip these keys
                continue;
            }
            const [formAnswerResult] = await db.execute(
                `INSERT INTO FormAnswers (question_tag, answer, submission_id) VALUES (?, ?, ?)`,
                [key, String(value), submissionId]
              )
        }

        return NextResponse.json({
            message: 'Form submitted and saved to DB!',
            userId,
            submissionId,
        });
    } catch (error: any) {
        console.error('Error in /api route:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
