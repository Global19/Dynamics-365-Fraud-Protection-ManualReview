// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

package com.griddynamics.msd365fp.manualreview.queues.model.persistence;

import com.griddynamics.msd365fp.manualreview.model.DisposabilityCheck;
import com.microsoft.azure.spring.data.cosmosdb.core.mapping.Document;
import com.microsoft.azure.spring.data.cosmosdb.core.mapping.PartitionKey;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;

import java.io.Serializable;

import static com.griddynamics.msd365fp.manualreview.queues.config.Constants.EMAIL_DOMAINS_CONTAINER_NAME;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(exclude = "_etag")
@Document(collection = EMAIL_DOMAINS_CONTAINER_NAME)
public class EmailDomain implements Serializable {
    @Id
    @PartitionKey
    private String id;
    private String emailDomainName;
    private DisposabilityCheck disposabilityCheck;

    @Version
    @SuppressWarnings("java:S116")
    String _etag;
    private long ttl;
}
