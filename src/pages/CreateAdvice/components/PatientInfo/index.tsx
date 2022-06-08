import React, { FC } from 'react';
import BfrCard from '@/components/base/BfrCard';
import './index.less';

interface PatientInfoState {
  patient?: Record<string, any>;
}

const PatientInfo: FC<PatientInfoState> = ({ patient = {} }) => {
  return (
    <BfrCard title="患者信息">
      <table className="bfr-table">
        <colgroup>
          <col width="100px" />
          <col />
          <col width="100px" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>姓名</th>
            <td>{patient.patient_name}</td>
            <th>患者类型</th>
            <td>{patient.patient_type}</td>
          </tr>
          <tr>
            <th>床号</th>
            <td>{patient.age}</td>
            <th>科室</th>
            <td>{patient.department}</td>
          </tr>
          <tr>
            <th>床号</th>
            <td>{patient.age}</td>
            <th>科室</th>
            <td>{patient.department}</td>
          </tr>
        </tbody>
      </table>
      <table
        className="bfr-table"
        style={{
          borderTop: 'none',
        }}
      >
        <colgroup>
          <col width="100px" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>诊断</th>
            <td>{patient.diagnosis}</td>
          </tr>
        </tbody>
      </table>
    </BfrCard>
  );
};

export default PatientInfo;
