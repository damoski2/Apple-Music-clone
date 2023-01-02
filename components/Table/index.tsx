import React from 'react'
import styled from "styled-components";
import { Table } from "antd";


const StyledTable = styled(Table).attrs((props: any) => ({

}))`
background: transparent !important;
color: #fff !important;
width: 100% !important;

tr{
  :nth-child(even){
    background: #1f1f1f !important;
  }
}

.ant-table-wrapper tr:nth-child(even){
  background: #1f1f1f !important;
}

.ant-table-wrapper .ant-table-tbody > tr > td{
  background: transparent !important;
  border: none !important;
}
.ant-table-thead > tr > th{
  background: transparent !important;
  color: #BFBFBF !important;
  text-align: left !important;
  border: none !important;
}

.ant-table-row:{
  :nth-child(even){
    background: #1f1f1f !important;
  }
}

.ant-table{
  background: transparent !important;
  color: #fff !important;
}

.ant-table-cell{
  color: #fff !important;
}

table{
  width: 100% !important;
}
`;



export default StyledTable