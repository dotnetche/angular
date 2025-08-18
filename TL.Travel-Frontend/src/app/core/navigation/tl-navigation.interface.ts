export interface ITLNavigation {
    id?: string;
    title?: string;
    translate?: string;
    type?: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
    classes?: string;
    url?: string;
    icon?: string;
    iconSize?: number | undefined;
    component?: any;
    permissions?: string[];
    children?: ITLNavigation[];
    canLoad?: any[] | undefined;
    canActivate?: any[] | undefined;
    hideInMenu?: boolean;
    isPublic?: boolean;
    disabled?: boolean;
    attachBaseRoute?: boolean;
    redirectToId?: string;
    redirectToRoute?: string;
}

export class TLNavigation implements ITLNavigation {

    constructor(obj?: Partial<TLNavigation>) {
        this.type = 'basic';
        this.isPublic = false;
        this.id = '';
        this.title = '';
        this.translate = '';
        this.hideInMenu = false;
        this.disabled = false;
        this.attachBaseRoute = true;

        if (obj != undefined) {
            Object.assign(this, obj);
        }

        if (this.redirectToId != undefined || this.redirectToRoute != undefined) {
            this.hideInMenu = true;
        }
    }

    public id: string;
    public title: string;
    public translate: string;
    public type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
    public classes?: string | undefined;
    public url?: string | undefined;
    public icon?: string | undefined;
    public iconSize?: number | undefined;
    public component?: any;
    public permissions?: string[] | undefined;
    public children?: ITLNavigation[] | undefined;
    public canLoad?: any[] | undefined;
    public canActivate?: any[] | undefined;
    public hideInMenu: boolean;
    public disabled: boolean;
    public isPublic: boolean;
    public attachBaseRoute: boolean;
    public redirectToId?: string;
    public redirectToRoute?: string;
}
