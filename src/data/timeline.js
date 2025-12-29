import { Languages, School, FileCheck, ShieldCheck, Plane, MapPin } from 'lucide-react';

export const visaPhases = [
    {
        id: 'phase-1',
        title: 'English Requirement',
        icon: Languages,
        tasks: [
            { id: 'p1-1', label: '모의고사 응시 (Mock Test)' },
            { id: 'p1-2', label: 'PTE 시험 예약' },
            { id: 'p1-3', label: '목표 점수 달성 (65+)' },
        ]
    },
    {
        id: 'phase-2',
        title: 'University Application',
        icon: School,
        tasks: [
            { id: 'p2-1', label: '서류 준비 (성적증명서/여권 등)' },
            { id: 'p2-2', label: '학교 지원서 제출' },
            { id: 'p2-3', label: '조건부 입학허가서(Offer) 수령' },
        ]
    },
    {
        id: 'phase-3',
        title: 'Offer Acceptance',
        icon: FileCheck,
        tasks: [
            { id: 'p3-1', label: '입학 조건 충족 (영어/학력)' },
            { id: 'p3-2', label: '학비 보증금 납부' },
            { id: 'p3-3', label: '입학 수락서 서명' },
        ]
    },
    {
        id: 'phase-4',
        title: 'CoE & Insurance',
        icon: ShieldCheck,
        tasks: [
            { id: 'p4-1', label: 'CoE (입학확인서) 발급' },
            { id: 'p4-2', label: 'OSHC (유학생 보험) 가입' },
        ]
    },
    {
        id: 'phase-5',
        title: 'Visa Application',
        icon: Plane,
        tasks: [
            { id: 'p5-1', label: 'GTE 사유서 작성' },
            { id: 'p5-2', label: '신체검사 (Health Exam)' },
            { id: 'p5-3', label: '바이오메트릭스 (지문/사진) 등록' },
            { id: 'p5-4', label: '비자 승인 대기 및 수령' },
        ]
    },
    {
        id: 'phase-6',
        title: 'Arrival & Setup',
        icon: MapPin,
        tasks: [
            { id: 'p6-1', label: '항공권 예매' },
            { id: 'p6-2', label: '숙소 구하기' },
            { id: 'p6-3', label: '현지 은행 계좌 개설' },
            { id: 'p6-4', label: 'TFN (세금 번호) 신청' },
        ]
    }
];
