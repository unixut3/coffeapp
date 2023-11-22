/*
 * *-------------------------------------------------------------------------------------------
 *  *------------------------------------------------------------------------------------------
 *  * @Class EvaluationQuestionRegistrationService
 *  * @Package com.pec.ppe.sa.service
 *  * @Description 클래스 설명
 *  * @author S13686
 *  * @since 2023. 01. 31
 *  * @version 1.0
 *  *
 *  * @Copyright (c) 2023 POSCO E&C All rights reserved.
 *  *------------------------------------------------------------------------------------------
 *  * Modification Information
 *  *------------------------------------------------------------------------------------------
 *  * 수정일                		 수정자          수정내용
 *  * -------------------------  ------------  ------------------------------------------------
 *  * 2023. 01. 31               S13686        최초생성
 *
 */
package com.pec.ppe.eo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pec.module.BaseService;
import com.pec.module.ContextInfo;
import com.pec.ppe.com.constants.CommonConstants;
import com.pec.ppe.eo.service.mapper.LogisticsYearEvaluationMapper;
import com.pec.ppe.eo.service.mapper.mapper;

/**
 * @author S13613
 *
 */
/**
 * @author S13740
 *
 */
@Service
@Transactional(CommonConstants.PEC_TRANSACTION_MANAGER)
public class service extends BaseService {

    @Autowired
    private mapper mapper;

    public mapper(mapper mapper) {
        this.mapper = mapper;
    }

    public List<Map<String, Object>> selectLogisticsYearEvaluationList(Map<String, Object> param) {
        return logisticsYearEvaluationMapper.selectLogisticsYearEvaluationList(param);
    }

}
