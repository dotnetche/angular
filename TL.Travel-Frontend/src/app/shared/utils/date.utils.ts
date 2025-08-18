import { DateDifference } from '../models/common/date-difference.model';
import { CommonUtils } from './common.utils';

export class DateUtils {
    static readonly TL_DATE_FORMATS = {
        parse: {
            dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
        },
        display: {
            dateInput: 'input',
            monthYearLabel: 'input',
            dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYearA11yLabel: { year: 'numeric', month: 'long' },
        }
    };

    /*static readonly TL_NGX_DATE_FORMATS: NgxMatDateFormats = {
        parse: {
            dateInput: 'DD.MM.YYYY LT',
        },
        display: {
            dateInput: 'DD.MM.YYYY LT',
            monthYearLabel: 'MMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
        }
    };*/

    public static getDateDifference(startDate: Date, endDate: Date): DateDifference | undefined {
        if (!CommonUtils.isNullOrEmpty(startDate) && !CommonUtils.isNullOrEmpty(endDate) && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            let seconds: number = Math.floor((endDate.getTime() - (startDate.getTime())) / 1000);
            let minutes: number = Math.floor(seconds / 60);
            let hours: number = Math.floor(minutes / 60);
            const days: number = Math.floor(hours / 24);

            hours = hours - (days * 24);
            minutes = minutes - (days * 24 * 60) - (hours * 60);
            seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

            return new DateDifference({ days: days, hours: hours, minutes: minutes, seconds: seconds });
        }
        else {
            return undefined;
        }
    }
}
