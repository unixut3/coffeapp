/*
 * *-------------------------------------------------------------------------------------------
 *  *------------------------------------------------------------------------------------------
 *  * @Class EvaluationQuestionRegistrationApi
 *  * @Package com.pec.ppe.sa.api
 *  * @Description 클래스 설명
 *  * @author S13613
 *  * @since 2023. 01. 31
 *  * @version 1.0
 *  *
 *  * @Copyright (c) 2023 POSCO E&C All rights reserved.
 *  *------------------------------------------------------------------------------------------
 *  * Modification Information
 *  *------------------------------------------------------------------------------------------
 *  * 수정일                		 수정자          수정내용
 *  * -------------------------  ------------  ------------------------------------------------
 *  * 2023. 01. 31               S13613        최초생성
 *
 */
package com.pec.ppe.eo.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pec.module.BaseAPI;
import com.pec.module.PropertiesBackend;
import com.pec.ppe.eo.service.LogisticsYearEvaluationService;

/**
 * @author S13613
 */
@RestController
@RequestMapping("/eo")
public class api extends BaseAPI {

    @Autowired
    private api api;

    public LogisticsYearEvaluationApi(LogisticsYearEvaluationService logisticsYearEvaluationService) {
        this.logisticsYearEvaluationService = logisticsYearEvaluationService;
    }

    @PostMapping("/selectLogisticsYearEvaluationList")
    public List<Map<String, Object>> selectLogisticsYearEvaluationList(@RequestBody Map<String, Object> param)
            throws Exception {
        List<Map<String, Object>> result = null;

        try {
            result = logisticsYearEvaluationService.selectLogisticsYearEvaluationList(param);
            setServerMessageCode(PropertiesBackend.CMM_INFO_RETRIEVE);
        } catch (Exception e) {
            throwException(e);
        }

        return result;
    }

}
