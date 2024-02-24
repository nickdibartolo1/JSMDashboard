import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import React from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import CustomAvatar from "@/components/custom-avatar";
import { getNameInitials } from "@/utilities";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionAvatar from "@/components/select-option-avatar";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions
} from "@/constants";
import { CompanyContactsTable } from "./contacts-table";

const EditPage = () => {
  const { saveButtonProps, formLoading, formProps, queryResult } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION
    }
  });

  const { selectProps, queryResult: queryResultUsers } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off"
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY
    }
  });

  const { avatarUrl, name } = queryResult?.data?.data || {};

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{ width: 96, height: 96, marginBottom: "24px" }}
              ></CustomAvatar>
              <Form.Item
                label="Company name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Please enter a company name"></Input>
              </Form.Item>
              <Form.Item
                label="Sales Owner"
                name="salesOwnerId"
                initialValue={formProps?.initialValues?.salesOwner?.id}
              >
                <Select
                  placeholder="Please select a sales owner"
                  {...selectProps}
                  options={
                    queryResultUsers.data?.data.map((user) => ({
                      value: user.id,
                      label: (
                        <SelectOptionAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl ?? undefined}
                        />
                      )
                    })) ?? []
                  }
                ></Select>
              </Form.Item>
              <Form.Item>
                <Select options={companySizeOptions} />
              </Form.Item>
              <Form.Item>
                <InputNumber
                  autoFocus
                  addonBefore="$"
                  min={0}
                  placeholder="0,00"
                />
              </Form.Item>
              <Form.Item label="Industry">
                ,<Select options={industryOptions}></Select>
              </Form.Item>
              <Form.Item label="Buisness type">
                ,<Select options={businessTypeOptions}></Select>
              </Form.Item>
              <Form.Item label="Country" name="Country">
                ,<Input placeholder="Country"></Input>
              </Form.Item>
              <Form.Item label="Website" name="Website">
                ,<Input placeholder="Website"></Input>
              </Form.Item>
            </Form>
          </Edit>
        </Col>
        <Col xs={24} xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
};

export default EditPage;
