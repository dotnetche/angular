import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Message } from '../models/common/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private _subject = new BehaviorSubject<Message | null>(null);

    public sendMessage(message: string): void {
        this._subject.next(new Message({ text: message }));
    }

    public cleanMessage(): void {
        this._subject.next(new Message({ text: ''}));
    }

    public getMessage(): Observable<Message | null> {
        return this._subject.asObservable();
    }

    public getMessageCurrentValue(): Message | null {
        return this._subject.value;
    }
}