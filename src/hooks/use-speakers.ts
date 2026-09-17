import { useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, getImageUrl } from '@/lib/appwrite';

export interface Speaker {
    $id?: string;
    name: string;
    title: string;
    company: string;
    bio?: string;
    topic?: string;
    photoId?: string;
    photoUrl?: string;
    linkedin?: string;
    twitter?: string;
    order?: number;
    isKeynote?: boolean;
    isActive?: boolean;
}

// Fallback data for demonstration when Appwrite is not configured
const fallbackSpeakers: Speaker[] = [
    {
        name: 'Dr. Werner Vogels',
        title: 'VP & CTO',
        company: 'Amazon.com',
        bio: 'Dr. Werner Vogels is the VP and CTO of Amazon.com. He is responsible for driving technology innovation within the company.',
        topic: 'Building for the Future: AI-Driven Cloud Architecture',
        linkedin: 'https://linkedin.com/in/wernervogels',
        twitter: 'Werner',
        isKeynote: true,
        order: 1,
    },
    {
        name: 'Deepak Singh',
        title: 'VP, Compute Services',
        company: 'Amazon Web Services',
        bio: 'Leading AWS Compute services including EC2, Lambda, and container services.',
        topic: 'Serverless at Scale: Lessons from AWS Lambda',
        linkedin: 'https://linkedin.com/in/deepaksingh',
        twitter: 'mndoci',
        isKeynote: true,
        order: 2,
    },
    {
        name: 'Priya Sharma',
        title: 'Principal Solutions Architect',
        company: 'Amazon Web Services',
        bio: 'Helping enterprises transform their infrastructure with cloud-native solutions.',
        topic: 'Multi-Region Resilience Patterns',
        linkedin: 'https://linkedin.com/in/priyasharma-aws',
        order: 3,
    },
    {
        name: 'Rahul Mehta',
        title: 'Senior Data Engineer',
        company: 'Netflix',
        bio: 'Building data pipelines that process petabytes of streaming data daily.',
        topic: 'Real-time Analytics with AWS Kinesis',
        linkedin: 'https://linkedin.com/in/rahulmehta-data',
        twitter: 'rahuldata',
        order: 4,
    },
    {
        name: 'Ananya Krishnan',
        title: 'ML Engineering Lead',
        company: 'Google Cloud',
        bio: 'Specializing in large language models and generative AI applications.',
        topic: 'Building Production ML Pipelines on AWS SageMaker',
        linkedin: 'https://linkedin.com/in/ananyakrishnan',
        order: 5,
    },
    {
        name: 'Vikram Patel',
        title: 'DevOps Architect',
        company: 'Flipkart',
        bio: 'Implementing CI/CD at scale for India\'s largest e-commerce platform.',
        topic: 'GitOps with EKS: A Journey to Production',
        linkedin: 'https://linkedin.com/in/vikrampatel-devops',
        twitter: 'vikramdevops',
        order: 6,
    },
    {
        name: 'Sneha Reddy',
        title: 'Security Engineer',
        company: 'Atlassian',
        bio: 'Cloud security specialist focused on zero-trust architectures.',
        topic: 'Zero Trust Security in AWS',
        linkedin: 'https://linkedin.com/in/snehareddy-sec',
        order: 7,
    },
    {
        name: 'Arjun Nair',
        title: 'Staff Engineer',
        company: 'Stripe',
        bio: 'Building highly available payment infrastructure.',
        topic: 'Event-Driven Microservices with EventBridge',
        linkedin: 'https://linkedin.com/in/arjunnair',
        twitter: 'arjunstripe',
        order: 8,
    },
];

export default function useSpeakers() {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchSpeakers = async () => {
            setLoading(true);

            if (!isAppwriteConfigured || !APPWRITE_DATABASE_ID) {
                // Use fallback if Appwrite isn't configured
                if (mounted) {
                    setSpeakers(fallbackSpeakers);
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await databases.listDocuments({
                    databaseId: APPWRITE_DATABASE_ID,
                    collectionId: COLLECTIONS.SPEAKERS,
                    queries: [
                        Query.limit(100),
                        Query.equal('isActive', true),
                        Query.orderAsc('order'),
                    ],
                });

                const mapped = response.documents.map((doc: any) => ({
                    ...doc,
                    photoUrl: doc.photoId ? getImageUrl(doc.photoId) : '',
                })) as Speaker[];

                if (mounted) setSpeakers(mapped);
            } catch (err: any) {
                // If collection doesn't exist yet, use fallback
                console.warn('Speakers collection not found, using fallback data:', err.message);
                if (mounted) {
                    setSpeakers(fallbackSpeakers);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSpeakers();

        return () => {
            mounted = false;
        };
    }, []);

    const keynote = speakers.filter(s => s.isKeynote);
    const regular = speakers.filter(s => !s.isKeynote);

    return { speakers, keynote, regular, loading, error };
}
