import { Component } from '@angular/core';
import { ActivationEnd, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from './core/translation/translate.service';
import { MessageService } from './shared/services/message.service';
import { ITLNavigation } from './core/navigation/tl-navigation.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {

    constructor(router: Router, translate: TranslateService, messageService: MessageService) {
        router.events.subscribe({
            next: (event) => {
                if (event instanceof ActivationStart) {
                    messageService.cleanMessage();
                }
                if (event instanceof ActivationEnd) {
                    if ('translate' in (event.snapshot.data as ITLNavigation)) {
                        const resource = (event.snapshot.data as ITLNavigation).translate ?? '';
                        const pageTitle: string = resource.length > 0 ? translate.getValue(resource) : '';

                        const currentTitle: string | undefined = messageService.getMessageCurrentValue()?.text;
                        if (currentTitle === null || currentTitle === undefined || currentTitle.length === 0) {
                            messageService.sendMessage(pageTitle);
                        }
                    }
                }
            }
        });
    }
}
