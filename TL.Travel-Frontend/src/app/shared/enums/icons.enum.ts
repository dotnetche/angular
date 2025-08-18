import {
    faFilter,
    faRedo,
    faQuestion,
    faPlusCircle,
    faPlus,
    faShip,
    faGavel,
    faHandshake,
    faCogs,
    faBook,
    faArchive,
    faFileAlt,
    faThList,
    faClipboardCheck,
    faFish,
    faTractor,
    faUser,
    faUserTie,
    faNewspaper,
    faUsersCog,
    faCertificate,
    faChartLine,
    faBalanceScale,
    faMoneyBillAlt,
    faUserShield,
    faHashtag,
    faAward,
    faFileSignature,
    faBug,
    faStamp,
    faCalendar,
    faCalendarAlt,
    faHourglassHalf,
    faPlusSquare,
    faBookOpen,
    faAddressBook,
    faSdCard,
    faGlobe,
    faDatabase,
    faPeopleArrows,
    faCheckDouble,
    faUserPlus,
    faTicketAlt,
    faUsers,
    faHandPointUp,
    faFlask,
    faSync,
    faVest,
    faWeight,
    faStickyNote,
    faUserGraduate,
    faListAlt,
    faConciergeBell,
    faTrash,
    faSave,
    faUndo,
    faEdit,
    faServer,
    faIdBadge,
    faHourglassEnd,
    faSearch,
    faExternalLinkAlt,
    faCheck,
    faTimes,
    faKey,
    faEye,
    faEyeSlash,
    faSignInAlt,
    faBan,
    faIdCard,
    faWheelchair,
    faBookReader,
    faChild,
    faBaby,
    faUserAlt,
    faBinoculars,
    faAnchor,
    faExchangeAlt,
    faDolly,
    faWarehouse,
    faWater,
    faTag,
    faShippingFast,
    faStore,
    faTachometerAlt,
    faChartBar,
    faMapMarkerAlt,
    faDownload,
    faReply,
    faEnvelope,
    faComment,
    faEnvelopeOpen,
    faClipboardList,
    faFileExport
} from '@fortawesome/free-solid-svg-icons';

import { faAddressBook as faAddressBookRegular } from '@fortawesome/free-regular-svg-icons';


export class AppIcons {
    /*
     * Всички икони от тази колекция трябва да имат префикс 'fa-'
     */
    public static readonly FA_ICONS = {
        'fa-sign-in': faSignInAlt,
        'fa-filter': faFilter,
        'fa-redo': faRedo,
        'fa-question': faQuestion,
        'fa-plus-circle': faPlusCircle,
        'fa-plus': faPlus,
        'fa-ship': faShip,
        'fa-gavel': faGavel,
        'fa-handshake': faHandshake,
        'fa-cogs': faCogs,
        'fa-book': faBook,
        'fa-archive': faArchive,
        'fa-file-alt': faFileAlt,
        'fa-th-list': faThList,
        'fa-clipboard-check': faClipboardCheck,
        'fa-fish': faFish,
        'fa-tractor': faTractor,
        'fa-user': faUser,
        'fa-user-tie': faUserTie,
        'fa-newspaper': faNewspaper,
        'fa-users-cog': faUsersCog,
        'fa-certificate': faCertificate,
        'fa-chart-line': faChartLine,
        'fa-balance-scale': faBalanceScale,
        'fa-money-bill-alt': faMoneyBillAlt,
        'fa-user-shield': faUserShield,
        'fa-hashtag': faHashtag,
        'fa-award': faAward,
        'fa-file-signature': faFileSignature,
        'fa-bug': faBug,
        'fa-stamp': faStamp,
        'fa-calendar-alt': faCalendarAlt,
        'fa-hourglass-half': faHourglassHalf,
        'fa-plus-square': faPlusSquare,
        'fa-book-open': faBookOpen,
        'fa-id-badge': faIdBadge,
        'fa-address-book': faAddressBook,
        'fa-address-book-regular': faAddressBookRegular,
        'fa-sd-card': faSdCard,
        'fa-globe': faGlobe,
        'fa-database': faDatabase,
        'fa-people-arrows': faPeopleArrows,
        'fa-check-double': faCheckDouble,
        'fa-user-plus': faUserPlus,
        'fa-ticket-alt': faTicketAlt,
        'fa-users': faUsers,
        'fa-handpoint-up': faHandPointUp,
        'fa-flask': faFlask,
        'fa-sync': faSync,
        'fa-vest': faVest,
        'fa-weight': faWeight,
        'fa-sticky-note': faStickyNote,
        'fa-user-graduate': faUserGraduate,
        'fa-list-alt': faListAlt,
        'fa-concierge-bell': faConciergeBell,
        'fa-trash': faTrash,
        'fa-save': faSave,
        'fa-undo': faUndo,
        'fa-edit': faEdit,
        'fa-server': faServer,
        'fa-hourglass-end': faHourglassEnd,
        'fa-search-icon': faSearch,
        'fa-external-link-alt': faExternalLinkAlt,
        'fa-check': faCheck,
        'fa-key': faKey,
        'fa-times': faTimes,
        'fa-eye': faEye,
        'fa-eye-slash': faEyeSlash,
        'fa-ban': faBan,
        'fa-id-card': faIdCard,
        'fa-wheelchair': faWheelchair,
        'fa-book-reader': faBookReader,
        'fa-child': faChild,
        'fa-baby': faBaby,
        'fa-user-alt': faUserAlt,
        'fa-binoculars': faBinoculars,
        'fa-anchor': faAnchor,
        'fa-exchange-alt': faExchangeAlt,
        'fa-dolly': faDolly,
        'fa-warehouse': faWarehouse,
        'fa-water': faWater,
        'fa-tag': faTag,
        'fa-shipping-fast': faShippingFast,
        'fa-store': faStore,
        'fa-tachometer-alt': faTachometerAlt,
        'fa-chart-bar': faChartBar,
        'fa-map-marker-alt': faMapMarkerAlt,
        'fa-download': faDownload,
        'fa-reply': faReply,
        'fa-envelope': faEnvelope,
        'fa-comment': faComment,
        'fa-envelope-open': faEnvelopeOpen,
        'fa-clipboard-list': faClipboardList,
        'fa-file-export': faFileExport
    };

    public static get FaIconsDictionary(): Map<string, any> {
        if (AppIcons.FA_ICONS_ARRAY == undefined) {
            const dictionary: Map<string, any> = new Map<string, any>();
            const keys = Object.keys(this.FA_ICONS);
            const values = Object.values(this.FA_ICONS);

            for (let i = 0; i < keys.length; i++) {
                dictionary.set(keys[i], values[i]);
            }

            AppIcons.FA_ICONS_ARRAY = dictionary;
        }

        return AppIcons.FA_ICONS_ARRAY;
    }

    private static FA_ICONS_ARRAY: Map<string, any>;

    // public static get IcIconsDictionary(): Map<string, any> {
    //     if (AppIcons.IC_ICONS_ARRAY == undefined) {
    //         const dictionary: Map<string, any> = new Map<string, any>();
    //         const keys = Object.keys(this.IC_ICONS);
    //         const values = Object.values(this.IC_ICONS);

    //         for (let i = 0; i < keys.length; i++) {
    //             dictionary.set(keys[i], values[i]);
    //         }

    //         AppIcons.IC_ICONS_ARRAY = dictionary;
    //     }

    //     return AppIcons.IC_ICONS_ARRAY;
    // }

    //private static IC_ICONS_ARRAY: Map<string, any>;
}