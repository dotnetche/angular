import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { TranslateService } from 'app/core/translation/translate.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';
import { MessageService } from 'app/shared/services/message.service';
import { SharedModule } from 'app/shared/shared.module';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'futuristic-layout',
    templateUrl: './futuristic.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        UserComponent,
        MatButtonModule,
        MatIconModule,
        LanguagesComponent,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        NotificationsComponent,
        RouterOutlet,
        QuickChatComponent,
        SharedModule,
    ],
})
export class FuturisticLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;

    @Input()
    navigation: FuseNavigationItem[] = [];

    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public pageTitle: string;
    private securityService: ISecurityService;
    private confirmDialog: TLConfirmDialog;
    private router: Router;
    private translate: TranslateService;
    /**
     * Constructor
     */
    public constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        router: Router,
        translate: TranslateService,
        messageService: MessageService,
        @Inject('ISecurityService') securityService: ISecurityService,
        confirmDialog: TLConfirmDialog,
    ) {
        this.router = router;
        this.translate = translate;
        this.securityService = securityService;
        this.confirmDialog = confirmDialog;
        messageService.getMessage().subscribe(message => {
            if (!CommonUtils.isNullOrUndefined(message)) {
                this.pageTitle = message!.text ?? '';
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    public get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    public ngOnInit(): void {
        // Subscribe to navigation data
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         this.navigation = navigation;
        //     });

        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    public ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    public toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
