import supabase from '@/app/db/dbInit';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const body = req.body;
            console.log(body);

            // 1. Insert user and get the ID
            console.log("Starting Supabase operations");
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert({ consent: body.consent })
                .select('user_id')
                .single();

            if (userError) {
                console.error('User insert error:', userError);
                throw userError;
            }

            const userId = userData.user_id;
            const refTag: string = body.referrerTag;

            // 2. Insert submission
            const { data: submissionData, error: submissionError } = await supabase
                .from('surveysubmissions')
                .insert({ user_id: userId })
                .select('id')
                .single();

            if (submissionError) {
                console.error('Submission insert error:', submissionError);
                throw submissionError;
            }

            const submissionId = submissionData.id;

            const maxTagValue = 100000;
            const userTag = Math.floor(Math.random() * maxTagValue) + 1;
            const referral = Object.entries(body.data)
                .filter(([key]) => key === 'referredBy')
                .map(([value]) => ({
                    referrer_tag: Number(refTag),
                    relationship: value,
                    user_tag: userTag
                }));
            if (referral.length > 0) {
                const { error: refAnswersError } = await supabase
                    .from('referrals')
                    .insert(referral);

                if (refAnswersError) {
                    console.error('Referral insert error:', refAnswersError);
                    throw refAnswersError;
                }
            }
            

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
                    .from('formanswers')
                    .insert(formAnswers);

                if (formAnswersError) {
                    console.error('Form answers insert error:', formAnswersError);
                    throw formAnswersError;
                }
            }

            return res.status(200).json({
                message: 'Form submitted and saved to DB!',
                userId,
                submissionId,
                tag: userTag
            });
        } catch (error: any) {
            // Log the entire error object for more details
            console.error('Error in /api route:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            if (error.code) {
                console.error('Error code:', error.code);
            }

            if (error.details) {
                console.error('Error details:', error.details);
            }

            return res.status(500).json(
                { message: 'Internal Server Error', error: error.message || 'Unknown error' }
            );
        }
    } else {
        // If the method is not POST, return method not allowed
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
