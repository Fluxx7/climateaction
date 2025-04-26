import supabase from '@/app/db/dbInit';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);

        // 1. Insert user and get the ID
        console.log("Starting Supabase operations");
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .insert({ consent: body.consent })
            .select('user_id')
            .single();

        if (userError) throw userError;
        const userId = userData.user_id;

        // 2. Insert submission
        const { data: submissionData, error: submissionError } = await supabase
            .from('SurveySubmissions')
            .insert({ user_id: userId })
            .select('id')
            .single();

        if (submissionError) throw submissionError;
        const submissionId = submissionData.id;

        // 3. Insert form answers
        const formAnswers = Object.entries(body.data)
            .filter(([key]) => key !== 'referredBy' && key !== 'otherReferralValue')
            .map(([key, value]) => ({
                question_tag: key,
                answer: String(value),
                submission_id: submissionId
            }));

        if (formAnswers.length > 0) {
            const { error: formAnswersError } = await supabase
                .from('FormAnswers')
                .insert(formAnswers);

            if (formAnswersError) throw formAnswersError;
        }

        return NextResponse.json({
            message: 'Form submitted and saved to DB!',
            userId,
            submissionId,
        });
    } catch (error: any) {
        // More detailed error logging
        console.error('Error in /api route:', error.message || error);
        console.error('Error stack:', error.stack);

        if (error.code) {
            console.error('Error code:', error.code);
        }

        if (error.details) {
            console.error('Error details:', error.details);
        }

        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}