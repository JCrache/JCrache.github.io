import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IMaterial } from 'app/shared/model/material.model';
import { Principal } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { MaterialService } from './material.service';
import { ImportService } from '../../core/importService/import.service';
import { ColumnFilter } from '../../shared/model/columnFilter.model';

@Component({
    selector: 'jhi-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.scss'],
    providers: [ImportService]
})
export class MaterialComponent implements OnInit, OnDestroy {
    currentAccount: any;
    materials: IMaterial[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    partImportDialogDisplayed = false;
    bevImportDialogDisplayed = false;
    materialImportDialogDisplayed = false;
    filters: any;

    constructor(
        private materialService: MaterialService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.filters = {
            numLegende: new ColumnFilter('string'),
            label: new ColumnFilter('string'),
            labelEn: new ColumnFilter('string')
        };
    }

    loadAll() {
        this.materialService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                customFilters: this.filters
            })
            .subscribe(
                (res: HttpResponse<IMaterial[]>) => this.paginateMaterials(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/material'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
                customFilters: this.filters
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate([
            '/material',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
                customFilters: this.filters
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMaterials();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMaterial) {
        return item.id;
    }

    registerChangeInMaterials() {
        this.eventSubscriber = this.eventManager.subscribe('materialListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    onImportPartsClick() {
        this.partImportDialogDisplayed = true;
    }

    onImportBEVClick() {
        this.bevImportDialogDisplayed = true;
    }

    onMaterialBEVClick() {
        this.materialImportDialogDisplayed = true;
    }

    onChangeFilter() {
        this.loadAll();
    }

    private paginateMaterials(data: IMaterial[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.materials = data;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
