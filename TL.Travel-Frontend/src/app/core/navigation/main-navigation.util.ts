import { Routes } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AdministrativeNavigation } from 'app/components/administration/administration.navigation';
import { BookingsNavigation } from 'app/components/bookings/bookings.navigation';
import { HomePagesNavigation } from 'app/components/home/home.navigation';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { IPermissionsService } from 'app/shared/interfaces/permissions.interface';
import { ITranslateService } from 'app/shared/interfaces/translate-service.interface';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { forkJoin, lastValueFrom } from 'rxjs';
import { Navigation } from './navigation.types';
import { ITLNavigation, TLNavigation } from './tl-navigation.interface';

export class MainNavigationUtil {

    public static getRoutes(navigation: ITLNavigation[]): Routes {
        const routes: Routes = [];
        this.buildRoutesFromNavigation(navigation, routes);
        return routes;
    }

    public static async getNavigation(permissionService: IPermissionsService, translateService: ITranslateService): Promise<Navigation> {
        const navigationItems = await lastValueFrom(forkJoin([
            this.getFuseNavigation(HomePagesNavigation, permissionService, translateService, 'home'),
            this.getFuseNavigation(BookingsNavigation, permissionService, translateService, 'booking'),
            this.getFuseNavigation(AdministrativeNavigation, permissionService, translateService, 'administration')
        ])).then(result => {
            if (result != undefined) {
                let menu: FuseNavigationItem[] = [];

                if (result[0] != undefined) {
                    menu = menu.concat(result[0]);
                }

                if (result[1] != undefined) {
                    menu = menu.concat(result[1]);
                }

                if (result[2] != undefined) {
                    menu = menu.concat(result[2]);
                }

                return menu;
            } else {
                return undefined;
            }
        });

        const navigation = {
            horizontal: navigationItems,
        } as Navigation;

        navigation.horizontal = navigationItems;
        navigation.compact = navigationItems;
        navigation.default = navigationItems;
        navigation.futuristic = navigationItems;

        return Promise.resolve(navigation);
    }

    public static async getFuseNavigation(navigation: ITLNavigation[], permissionService: IPermissionsService, translateService: ITranslateService, baseRoute?: string): Promise<FuseNavigationItem[] | undefined> {
        return MainNavigationUtil.getRecursiveFuseNavigation(navigation, true, permissionService, translateService, baseRoute);
    }

    private static buildRoutesFromNavigation(menu: ITLNavigation[], routes: Routes, baseRoute?: string, parentCanActive?: any[]) {
        if (menu !== undefined) {
            for (const item of menu.filter(x => x.type != 'basic' || x.component != undefined || x.redirectToRoute != undefined && x.redirectToId != undefined)) {

                if (item.component !== undefined) {
                    let path: string = item.url ?? '';

                    path = this.buildRoute(path, baseRoute);

                    if (item.isPublic) {
                        routes.push({
                            path: path,
                            canActivate: [...item.canActivate ?? parentCanActive ?? []],
                            component: item.component,
                            data: {
                                translate: item.translate
                            }
                        });
                    } else {
                        routes.push({
                            path: path,
                            canActivate: [AuthGuard, ...item.canActivate ?? parentCanActive ?? []],
                            component: item.component,
                            data: {
                                translate: item.translate,
                                permissions: {
                                    only: item.permissions,
                                }
                            }
                        });
                    }
                } else if (item.redirectToId != undefined) {
                    let menuElement = this.findElementById(item.redirectToId, menu);
                    if (menuElement != undefined) {
                        routes.push({
                            path: item.url ?? '',
                            redirectTo: this.buildRoute(menuElement.url ?? '', baseRoute),
                            canActivate: [...item.canActivate ?? parentCanActive ?? []]
                        });
                    }
                } else if (item.redirectToRoute != undefined) {
                    routes.push({
                        redirectTo: this.buildRoute(item.redirectToRoute, baseRoute),
                        canActivate: [...item.canActivate ?? parentCanActive ?? []]
                    });
                }

                if (item.children !== undefined) {
                    MainNavigationUtil.buildRoutesFromNavigation(item.children, routes, baseRoute, item.canActivate);
                }
            }
        }
    }

    private static buildRoute(path: string, baseRoute?: string) {

        if (path.startsWith('/')) {
            path = path.slice(1);
        }

        if (baseRoute != undefined) {
            if (baseRoute.startsWith('/')) {
                baseRoute = baseRoute.slice(1);
            }

            if (path != '') {
                path = `${baseRoute}/${path}`;
            } else {
                path = baseRoute;
            }
        }

        return path;
    }

    private static async getRecursiveFuseNavigation(menu: ITLNavigation[], isAuthenticated: boolean, permissionService: IPermissionsService, translateService: ITranslateService, baseRoute?: string): Promise<FuseNavigationItem[] | undefined> {
        let navigation: FuseNavigationItem[] | undefined = [];

        if (menu !== undefined) {
            navigation = [];
            for (const item of menu.filter(x => !x.hideInMenu)) {

                const menuItem = new TLNavigation(item);

                if ((!isAuthenticated && menuItem.isPublic) || (isAuthenticated && await MainNavigationUtil.hasPermissions(menuItem.permissions, permissionService))) {

                    let link: string | undefined = undefined;
                    let url: string | undefined = menuItem.url;


                    if (url != undefined && url != '' && !url.startsWith('/')) {
                        url = '/' + url;
                    }

                    if (baseRoute != undefined && url != undefined && menuItem.attachBaseRoute) {
                        if (!baseRoute.startsWith('/')) {
                            baseRoute = '/' + baseRoute;
                        }
                        link = `${baseRoute}${url}`;
                    } else {
                        link = url;
                    }

                    const fuseItem: FuseNavigationItem = {
                        id: menuItem.id,
                        title: CommonUtils.capitalize(translateService.getValue(menuItem.translate)),
                        type: menuItem.type,
                        classes: {
                            title: menuItem.classes
                        },
                        icon: menuItem.icon,
                        link: link,
                        disabled: menuItem.disabled,
                        permissions: menuItem.permissions
                    };

                    if (menuItem.children !== undefined && menuItem.children.length > 0) {
                        fuseItem.children = await this.getRecursiveFuseNavigation(menuItem.children, isAuthenticated, permissionService, translateService, baseRoute);
                    }

                    if ((menuItem.type == 'group' || menuItem.type == 'collapsable') && fuseItem.children != undefined && fuseItem.children.length > 0) {
                        navigation.push(fuseItem);
                    } else if (menuItem.type == 'basic') {
                        navigation.push(fuseItem);
                    }
                }
            }
        }

        return navigation;
    }

    private static findElementById(id: string, menu: ITLNavigation[]): ITLNavigation | undefined {
        for (let menuItem of menu) {
            if (menuItem.id == id) {
                return menuItem;
            } else if (menuItem.children != undefined) {
                let element = this.findElementById(id, menuItem.children);
                if (element != undefined) return element;
            }
        }

        return undefined;
    }

    private static hasPermissions(permissions: string[] | undefined, permissionService: IPermissionsService): Promise<boolean> {

        let hasPermission: boolean = false;
        if (permissions != undefined && permissions != null && permissions.length > 0) {
            for (const permission of permissions) {
                const result: boolean = permissionService.hasAny(permission);

                if (result) {
                    hasPermission = true;
                    break;
                }
            }
        } else {
            return Promise.resolve(true);
        }

        return Promise.resolve(hasPermission);
    }
}
