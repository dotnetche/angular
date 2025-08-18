import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';

@Component({
    selector: 'redirect',
    template: '',
})
export class RedirectComponent implements OnInit {

    private router: Router;
    private securityService: ISecurityService;

    public constructor(router: Router, @Inject('ISecurityService') securityService: ISecurityService) {
        this.router = router;
        this.securityService = securityService;
    }

    public async ngOnInit(): Promise<void> {
        let path = await this.securityService.getUserRedirectPath();
        
        this.router.navigate([path]);
    }
}