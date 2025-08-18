import { EventEmitter, Injectable } from '@angular/core';
import { IPermissionsService } from 'app/shared/interfaces/permissions.interface';
import { NgxPermissionsObject, NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PermissionsService implements IPermissionsService {
    private permissionsService: NgxPermissionsService;
    private allPermissions?: string[];
    private permissionsLoadedInternal: BehaviorSubject<boolean>;

    private _permissionsLoaded: EventEmitter<void>;

    public get permissionsLoaded(): Subject<void> {
        return this._permissionsLoaded;
    }

    public constructor(permissionsService: NgxPermissionsService) {
        this.permissionsService = permissionsService;
        this._permissionsLoaded = new EventEmitter();
        this.permissionsLoadedInternal = new BehaviorSubject<boolean>(false);
    }

    public has(permission: string): boolean {
        if (this.allPermissions != undefined) {
            return this.allPermissions.some(x => x == permission);
        } else {
            return false;
        }
    }

    public hasAnyWait(...permissions: string[]): Promise<boolean> {

        if (this.permissionsLoadedInternal.value) {
            const result = this.hasAny(...permissions);
            return Promise.resolve(result);
        } else {
            return this.permissionsLoadedInternal.toPromise().then(result => {
                if (result) {
                    return this.hasAny(...permissions);
                }

                return false;
            });
        }
    }

    public hasAny(...permissions: string[]): boolean {
        if (this.allPermissions != undefined) {
            for (const permission of permissions) {
                if (this.allPermissions.includes(permission)) {
                    return true;
                }
            }
        }

        return false;
    }

    public hasAll(...permissions: string[]): boolean {
        if (this.allPermissions != undefined) {
            for (const permission of permissions) {
                if (!this.allPermissions.includes(permission)) {
                    return false;
                }
            }
        }
        return true;
    }

    public hasNone(...permissions: string[]): boolean {
        return !this.hasAny(...permissions);
    }

    public loadPermissions(permissions: string[]) {
        this.permissionsService.loadPermissions(permissions);
        this.allPermissions = this.getAllPermissions();
        this._permissionsLoaded.emit();

        this.permissionsLoadedInternal.next(true);
        this.permissionsLoadedInternal.complete();
        this.permissionsLoadedInternal = new BehaviorSubject<boolean>(true);
    }

    private getAllPermissions(): string[] {
        const ngxPermissions: NgxPermissionsObject = this.permissionsService.getPermissions();
        return Object.keys(ngxPermissions).map((key: string) => {
            return ngxPermissions[key].name;
        });
    }
}