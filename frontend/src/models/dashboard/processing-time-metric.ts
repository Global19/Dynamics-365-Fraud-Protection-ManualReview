// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { computed, observable } from 'mobx';
import { Duration, toSeconds, parse } from 'iso8601-duration';
import { ProcessingTimeMetricDto } from '../../data-services/api-services/models/dashboard';
import { TimeMetric } from './time-metrics';
import { CurrentProgress } from './progress-performance-metric';
import { convertSecondsToDhms } from '../../utils/date/convert-seconds-to-dhms';

export class ProcessingTimeMetric implements ProcessingTimeMetricDto {
    @observable currentPeriod = new TimeMetric();

    @observable previousPeriod = new TimeMetric();

    fromDto(processingTimeMetricDto: ProcessingTimeMetricDto) {
        this.currentPeriod = new TimeMetric(processingTimeMetricDto.currentPeriod);
        this.previousPeriod = new TimeMetric(processingTimeMetricDto.previousPeriod);

        return this;
    }

    @computed
    get waistedTime(): CurrentProgress {
        return {
            current: this.getDurationString(this.currentPeriod.parsedWastedDuration) || 0,
            progress: 0
        };
    }

    @computed
    get getTimeToMakeDecision(): CurrentProgress {
        return {
            current: this.calculateTimeToMakeDecision(this.currentPeriod.resolutionApplyingDuration),
            progress: 0
        };
    }

    @computed
    get reportSummary() {
        return [
            this.waistedTime,
            this.getTimeToMakeDecision
        ];
    }

    private getDurationString(duration: Duration) {
        if (!duration) {
            return '';
        }

        let resultDurationString = '';
        const { days, hours, minutes } = duration;

        if (days) {
            resultDurationString += `${days}d `;
        }

        if (hours) {
            resultDurationString += `${hours}h `;
        }

        if (minutes) {
            resultDurationString += `${minutes}m`;
        }

        return resultDurationString;
    }

    private calculateTimeToMakeDecision(durationStr: string) {
        const duration = parse(durationStr);
        const durationInSeconds = toSeconds(duration);

        const ratio = durationInSeconds / this.currentPeriod.resolutionAmount;

        if (!Number.isFinite(ratio)) {
            return 0;
        }

        const avgDuration = convertSecondsToDhms(ratio);

        return this.getDurationString(avgDuration);
    }
}
