package com.abhinavinfratek.cms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResendEmailRequest(
        String from,
        List<String> to,
        String subject,
        String html,
        @JsonProperty("reply_to")
        String replyTo
) {
}
