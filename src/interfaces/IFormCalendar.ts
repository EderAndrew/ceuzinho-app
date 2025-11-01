export interface IFormCalendar{
    type: string,
    theme: string,
    period: string,
    teacherOne: number,
    teacherTwo: number,
    userId: number
}

export interface FormState {
    theme: string;
    selectedRoomType: string;
    selectedIds: number[];
    selectedPeriodsType: string;
    errors: FormErrors;
}

export interface FormErrors {
    theme?: string;
    teachers?: string;
}