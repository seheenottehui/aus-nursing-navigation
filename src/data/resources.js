export const nursingResources = [
    {
        id: 'biology',
        title: 'Biology Basics',
        description: 'Cell structure, diffusion, and basic life processes.',
        items: [
            {
                id: 'bio-1',
                label: 'Cell structure',
                videos: [
                    { title: 'Introduction to Cells: The Grand Cell Tour (Amoeba Sisters)', url: 'https://www.youtube.com/watch?v=8IlzKri08kk' },
                    { title: 'Biology: Cell Structure I Nucleus Medical Media', url: 'https://www.youtube.com/watch?v=URUJD5NEXC8' }
                ],
                reads: [
                    { title: 'Khan Academy: Eukaryotic Cells', url: 'https://www.khanacademy.org/science/biology/structure-of-a-cell' }
                ]
            },
            {
                id: 'bio-2',
                label: 'Diffusion & osmosis',
                videos: [
                    { title: 'Osmosis and Water Potential (Updated)', url: 'https://www.youtube.com/watch?v=L-osEc07vms' }
                ],
                reads: [
                    { title: 'Bitesize: Diffusion and Osmosis', url: 'https://www.bbc.co.uk/bitesize/guides/zc9tyrd/revision/1' }
                ]
            },
            {
                id: 'bio-3',
                label: 'Homeostasis',
                videos: [
                    { title: 'Homeostasis and Negative/Positive Feedback', url: 'https://www.youtube.com/watch?v=Iz0Q9nTZCw4' }
                ],
                reads: []
            }
        ]
    },
    {
        id: 'anatomy',
        title: 'Anatomy & Physiology',
        description: 'Key systems you will study in your first year.',
        items: [
            { id: 'ap-1', label: 'Cardiovascular system', videos: [], reads: [] },
            { id: 'ap-2', label: 'Respiratory system', videos: [], reads: [] },
            { id: 'ap-3', label: 'Nervous system', videos: [], reads: [] },
            { id: 'ap-4', label: 'Renal system', videos: [], reads: [] },
            { id: 'ap-5', label: 'Immune system', videos: [], reads: [] }
        ]
    },
    {
        id: 'terminology',
        title: 'Medical Terminology',
        description: 'Prefixes, suffixes, and common clinical terms.',
        items: [
            { id: 'term-1', label: 'Prefixes & suffixes', videos: [], reads: [] },
            { id: 'term-2', label: 'Vital signs terms', videos: [], reads: [] },
            { id: 'term-3', label: 'Common clinical words', videos: [], reads: [] }
        ]
    }
];
