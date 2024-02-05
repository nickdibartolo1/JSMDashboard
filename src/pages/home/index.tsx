import { DealsChart, UpcomingEvents } from "@/components";
import { Col, Row } from "antd";
import React from "react";

export const Home = () => {
  return (
    <div>
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "480px"
          }}
        >
          <UpcomingEvents></UpcomingEvents>
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "480px"
          }}
        >
          <DealsChart></DealsChart>
        </Col>
      </Row>
    </div>
  );
};
