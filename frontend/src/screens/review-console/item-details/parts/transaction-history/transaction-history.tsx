// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { Component } from 'react';
import cn from 'classnames';
import autobind from 'autobind-decorator';
import {
    ColumnActionsMode,
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode
} from '@fluentui/react/lib/DetailsList';
import { MessageBar } from '@fluentui/react/lib/MessageBar';
import { Text } from '@fluentui/react/lib/Text';
import { ItemDetailsTile } from '../../item-details-tile';
import { PreviousPurchase } from '../../../../../models/item/purchase/previous-purchase';
import {
    convertToUTCAndFormatToLocalString,
    formatDateStringToJSDate,
    formatToMMMDYYY
} from '../../../../../utils/date';
import { Price } from '../../../../../components/price';
import { IconText } from '../../../../../components/icon-text';

import { Address, ADDRESS_TYPE, Item } from '../../../../../models/item';
import './transaction-history.scss';

const CN = 'transaction-history';

interface TransactionHistoryProps {
    className?: string;
    item: Item
}

export class TransactionHistory extends Component<TransactionHistoryProps, never> {
    private readonly valuePlaceholder = (<span className="placeholder">N/A</span>);

    private readonly purchaseHistoryColumns: IColumn[] = [
        {
            key: 'lastMerchantStatus',
            name: 'Status',
            iconName: 'Page',
            isIconOnly: true,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            minWidth: 16,
            maxWidth: 16,
            onRender: this.renderTransactionStatus,
        },
        {
            key: 'transaction',
            name: 'Transaction',
            minWidth: 150,
            maxWidth: 150,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: this.renderTransactionCell,
        },
        {
            key: 'amount',
            name: 'Amount',
            minWidth: 70,
            maxWidth: 100,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (pp: PreviousPurchase) => (
                <Price value={pp.totalAmountInUSD} />
            )
        },
        {
            key: 'bankStatus',
            name: 'Bank status/code',
            minWidth: 100,
            maxWidth: 150,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: this.renderBankStatus,
        },
        {
            key: 'paymentInfo',
            name: 'Payment Info',
            minWidth: 150,
            maxWidth: 200,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: this.renderPaymentInfo,
        },
        {
            key: 'shipping',
            name: 'Shipping location',
            minWidth: 130,
            maxWidth: 200,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (pp: PreviousPurchase) => this.renderAddress(pp, ADDRESS_TYPE.SHIPPING),
        },
        {
            key: 'billing',
            name: 'Billing location',
            minWidth: 130,
            maxWidth: 200,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (pp: PreviousPurchase) => this.renderAddress(pp, ADDRESS_TYPE.BILLING),
        },
        {
            key: 'ip',
            name: 'IP address',
            minWidth: 100,
            maxWidth: 150,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (pp: PreviousPurchase) => (
                <Text variant="small">{pp?.deviceContext?.ipAddress || ''}</Text>
            )
        },
        {
            key: 'riskScore',
            name: 'Score',
            fieldName: '',
            minWidth: 50,
            maxWidth: 70,
            isPadded: true,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (pp: PreviousPurchase) => (
                <Text variant="small">{pp.riskScore}</Text>
            )
        }
    ];

    @autobind
    renderTransactionStatus(pp: PreviousPurchase) {
        const tooltipText = `${pp.lastMerchantStatusReason}, ${formatToMMMDYYY(pp.lastMerchantStatusDate)}`;
        return (
            <IconText
                className={`${CN}__status`}
                text=""
                textVariant="small"
                placeholder=""
                iconValue={pp.lastMerchantStatus}
                icons={{
                    GOOD: {
                        value: 'Approved',
                        iconName: 'CompletedSolid',
                        tooltipText,
                    },
                    BAD: {
                        value: 'Rejected',
                        iconName: 'Blocked2Solid',
                        tooltipText,
                    },
                }}
            />
        );
    }

    @autobind
    renderTransactionCell(pp: PreviousPurchase) {
        return (
            <div className={`${CN}__transaction-column`} title={pp.purchaseId}>
                <Text variant="small">
                    {pp.purchaseId}
                </Text>
                <div>
                    <Text variant="small">
                        (
                        {convertToUTCAndFormatToLocalString(pp.merchantLocalDate, this.valuePlaceholder)}
                        )
                    </Text>
                </div>
            </div>
        );
    }

    @autobind
    renderBankStatus(pp: PreviousPurchase) {
        const tooltipText = `${pp.lastBankEventStatus}, ${formatToMMMDYYY(pp.lastBankEventDate)}`;
        return (
            <IconText
                text={pp.lastBankEventResponseCode}
                textVariant="small"
                placeholder=""
                iconValue={pp.lastBankEventStatus}
                icons={{
                    GOOD: {
                        value: 'Approved',
                        iconName: 'CompletedSolid',
                        tooltipText,
                    },
                    BAD: {
                        value: 'Declined',
                        iconName: 'Blocked2Solid',
                        tooltipText,
                    },
                    UNKNOWN: {
                        value: 'Unknown',
                        iconName: 'UnknownSolid',
                        tooltipText,
                    }
                }}
            />
        );
    }

    @autobind
    renderAddress(pp: PreviousPurchase, addressType: ADDRESS_TYPE) {
        const address: Address | undefined = pp.addressList
            .find(addr => addr.type === addressType);

        const text = `${address?.city || ''}${address?.city ? ', ' : ''}${address?.country || ''}`;

        return (
            <Text variant="small">{text}</Text>
        );
    }

    @autobind
    renderPaymentInfo(pp: PreviousPurchase) {
        const paymentInstrument = pp.paymentInstrumentList[0];

        const topText = `${paymentInstrument?.cardType || ''} ${paymentInstrument?.type || ''} ${paymentInstrument?.lastFourDigits || ''}`;

        return (
            <div>
                <Text variant="small">
                    {topText}
                </Text>
                <div>
                    <Text variant="small">
                        {paymentInstrument?.holderName || ''}
                    </Text>
                </div>
            </div>
        );
    }

    renderHistory() {
        const { item } = this.props;

        const items = item.purchase.previousPurchaseList
            .slice()
            .sort((prev, next) => {
                const prevDate = formatDateStringToJSDate(prev.merchantLocalDate);
                const nextDate = formatDateStringToJSDate(next.merchantLocalDate);

                if (prevDate && nextDate) {
                    return nextDate.getTime() - prevDate.getTime();
                }

                return 0;
            });

        return (
            <DetailsList
                items={items}
                columns={this.purchaseHistoryColumns}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                isHeaderVisible
                cellStyleProps={{
                    cellExtraRightPadding: 5,
                    cellLeftPadding: 10,
                    cellRightPadding: 10
                }}
            />
        );
    }

    render() {
        const { className } = this.props;

        return (
            <ItemDetailsTile
                className={cn(CN, className)}
                title="Transaction history"
            >
                <MessageBar className={`${CN}__message-bar`}>
                    The table contains full information only for last 10 transactions / last week transactions.
                </MessageBar>
                {this.renderHistory()}
            </ItemDetailsTile>
        );
    }
}
