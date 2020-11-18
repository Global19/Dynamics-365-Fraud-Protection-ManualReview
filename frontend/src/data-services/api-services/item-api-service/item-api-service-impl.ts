// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { inject, injectable } from 'inversify';
import { LABEL } from '../../../constants';
import { TYPES } from '../../../types';
import { AuthenticationService, Configuration } from '../../../utility-services';
import { BaseApiService } from '../../base-api-service';
import { DeleteItemLockResponse } from './api-models/delete-item-lock-response';
import { ItemApiService } from '../../interfaces';
import { GetItemResponse, GetLockedItemsResponse } from './api-models';

@injectable()
export class ItemApiServiceImpl extends BaseApiService implements ItemApiService {
    /**
     * @param config
     * @param authService
     */
    constructor(
        @inject(TYPES.CONFIGURATION) private readonly config: Configuration,
        @inject(TYPES.AUTHENTICATION) private readonly authService: AuthenticationService
    ) {
        super(
            `${config.apiBaseUrl}/items`,
            {
                request: {
                    onFulfilled: authService.apiRequestInterceptor.bind(authService)
                },
                response: {
                    onRejection: authService.apiResponseInterceptor.bind(authService)
                }
            }
        );
    }

    patchItemTag(id: string, tags: string[], queueId?: string) {
        return this.patch<never>(`/${id}/tags`, { tags }, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: { queueId }
        });
    }

    deleteItemLock(id: string, queueId?: string) {
        return this.delete<DeleteItemLockResponse>(`/${id}/lock`, { params: { queueId } });
    }

    patchItemLabel(id: string, label: LABEL, queueId?: string) {
        return this.patch<never>(`/${id}/label`, {
            label
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: { queueId }
        });
    }

    putItemNote(id: string, note: string, queueId?: string) {
        return this.put<never>(`/${id}/note`, { note }, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: { queueId }
        });
    }

    getItem(id: string, queueId?: string) {
        return this.get<GetItemResponse>(`/${id}`, { params: { queueId } });
    }

    getLockedItems() {
        return this.get<GetLockedItemsResponse>('/locked', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
