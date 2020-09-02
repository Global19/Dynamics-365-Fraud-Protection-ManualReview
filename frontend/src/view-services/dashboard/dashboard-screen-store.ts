import { inject, injectable } from 'inversify';
import {
    action, computed, observable
} from 'mobx';

import { TYPES } from '../../types';
import { QueueStore } from '../queues';
import { CollectedInfoService, QueueService, UserService } from '../../data-services/interfaces';
import { User } from '../../models/user';

@injectable()
export class DashboardScreenStore {
    @observable users: User[] | null = null;

    @observable fromDate: Date | null = null;

    @observable toDate: Date | null = null;

    constructor(
        @inject(TYPES.USER_SERVICE)
        private userService: UserService,

        @inject(TYPES.QUEUE_STORE)
        public readonly queueStore: QueueStore,

        @inject(TYPES.QUEUE_SERVICE)
        public readonly queueService: QueueService,

        @inject(TYPES.COLLECTED_INFO_SERVICE)
        private readonly collectedInfoService: CollectedInfoService
    ) {
        /**
         * Loading users and users photo for the search bar
         */

        this.users = this.userService.getUsers();

        /**
         * Loading queues for the search bar
         */
        this.queueStore.loadQueues();

        /**
         * Loads historical users beforehand
         */
        this.collectedInfoService.getCollectedInfoUsersAndCache();

        /**
         * Loads historical queues beforehand
         */
        this.collectedInfoService.getQueuesCollectedInfo();
    }

    @computed
    get getFromDate() {
        return this.fromDate;
    }

    @computed
    get getToDate() {
        return this.toDate;
    }

    @action
    setFromDate(date: Date) {
        this.fromDate = date;
    }

    @action
    setToDate(date: Date) {
        this.toDate = date;
    }

    @action
    clearDates() {
        this.toDate = null;
        this.fromDate = null;
    }
}