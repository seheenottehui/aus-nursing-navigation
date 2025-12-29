import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

// Initial default data (fallback if nothing in DB and nothing in LocalStorage)
import { visaPhases } from '../data/timeline';

// We need the raw data structure for initials, but we can just use empty arrays/objects
// and let the components handle defaults if missing.
const defaultData = {
    timelineData: visaPhases.map(p => ({ ...p, tasks: p.tasks || [] })), // Ensure tasks array
    calendarEvents: [],
    resources: [
        { id: 'r1', title: 'AHPRA Registration Guide', type: 'pdf', url: '#', thumbnail: 'https://placehold.co/400x300/e6f2ff/0066cc?text=PDF' },
        { id: 'r2', title: 'PTE Speaking Tips', type: 'video', url: '#', thumbnail: 'https://placehold.co/400x300/fff0f0/ff4d4d?text=Video' },
    ],
    finance: {
        goal: 30000,
        saved: 5000
    }
};

export function useFirestoreData() {
    const { currentUser } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setData(docSnap.data());
                setLoading(false);
            } else {
                // Document doesn't exist -> Migration or Init
                initializeData(userDocRef);
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            setError(err);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const initializeData = async (ref) => {
        // Check Local Storage for migration
        const localTimeline = getLocal('visa-timeline-unique');
        const localEvents = getLocal('calendar-events-unique');
        const localResources = getLocal('resources-unique');
        const localFinanceGoal = getLocal('finance-goal');
        const localFinanceSaved = getLocal('finance-saved');

        let initialPayload = { ...defaultData };

        if (localTimeline || localEvents || localFinanceGoal) {
            console.log("Migrating local data to Firestore...");
            // Migration detected
            if (localTimeline) initialPayload.timelineData = localTimeline;
            if (localEvents) initialPayload.calendarEvents = localEvents;
            if (localResources) initialPayload.resources = localResources;
            if (localFinanceGoal || localFinanceSaved) {
                initialPayload.finance = {
                    goal: localFinanceGoal || 30000,
                    saved: localFinanceSaved || 5000
                };
            }
        }

        try {
            await setDoc(ref, initialPayload);
        } catch (e) {
            console.error("Failed to initialize user data:", e);
            setError(e);
            setLoading(false);
        }
    };

    const updateSection = async (sectionKey, newValue) => {
        if (!currentUser || !data) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
            await updateDoc(userDocRef, {
                [sectionKey]: newValue
            });
        } catch (e) {
            console.error("Update failed:", e);
        }
    };

    const updateFinance = async (field, value) => {
        if (!currentUser || !data) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        const currentFinance = data.finance || { goal: 30000, saved: 5000 };
        try {
            await updateDoc(userDocRef, {
                finance: { ...currentFinance, [field]: value }
            });
        } catch (e) {
            console.error("Finance update failed:", e);
        }
    };

    return {
        data,
        loading,
        error,
        updateSection,
        updateFinance
    };
}

// Helper to safely parse JSON from localStorage
function getLocal(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        return null;
    }
}
