/*
 * *-------------------------------------------------------------------------------------------
 *  *------------------------------------------------------------------------------------------
 *  * @Class EvaluationQuestionRegistrationMapper
 *  * @Package com.pec.ppe.sa.service.mapper
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
 *  * 2023. 03. 27               S13613        최초생성
 *
 */
package com.pec.ppe.eo.service.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

/**
 * @author S13613
 *
 */
@Mapper
public interface mapper {

    public List<Map<String, Object>> selectLogisticsYearEvaluationList(Map<String, Object> param);

}