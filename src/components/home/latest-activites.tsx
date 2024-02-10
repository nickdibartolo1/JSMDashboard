import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List } from "antd";
import React from "react";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
} from "@/graphql/queries";
import { useList } from "@refinedev/core";
import dayjs from "dayjs";

const LatestActivities = () => {
  const {
    data: audit,
    isLoadingAudit,
    isError,
    error
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
    }
  });

  const dealIds = audit?.data?.map((audit) => audit?.targetId);

  const { data: deals, isLoading: isLoadingDeals } = useList({
    resource: "deals",
    queryOptions: { enabled: !!dealIds?.length },
    pagination: {
      mode: "off"
    },
    filters: [{ field: "id", operator: "in", value: dealIds }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
    }
  });

  if (isError) {
    console.log(error);
    return null;
  }

  const isLoading = isLoadingAudit || isLoadingDeals;

  return (
    <Card
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            LatestActivities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={(_, index) => <LatestActivitiesSkeleton key={index} />}
        ></List>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audit?.data}
          renderItem={(item) => {
            const deal =
              deals?.data.find((deal) => deal.id === item.targetId) ||
              undefined;

              return(
                <List.Item>
                    <List.Item.Meta title={dayjs(deal?.createdAt).format('MMM DD, YYYY - HH:mm')}/>
                </List.Item>
              )
          }}
        ></List>
      )}
    </Card>
  );
};

export default LatestActivities;
