package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.entity.Enquiry;

public interface MailService {

    void sendEnquiryEmails(Enquiry enquiry);
}
