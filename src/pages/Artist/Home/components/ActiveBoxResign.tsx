import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  ResignActiveBoxParam,
  useResignActiveBoxMutation,
} from '@/services/manager/artist';
import { UseQueryResult } from 'react-query';
import { Box, useBoxes } from '@/services/manager/box';
import { format } from 'date-fns';

export type ArtistResignProps = {
  box: Box;
};


const ActiveBoxResign: React.FC<ArtistResignProps> = (props) => {
  const box = props.box;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [resignValue, setResignValue] = useState<ResignActiveBoxParam>({
    active_box_id: box.active_box?.id ?? 0,
    artist_id: box?.artist?.id ?? 0,
    box_id: box?.id ?? 0,
    ended_on: format(new Date(), 'yyyy-MM-dd'),
  });

  const cleanupState = useCallback(() => {
    setResignValue({
      active_box_id: box.active_box?.id ?? 0,
      artist_id: box?.artist?.id ?? 0,
      box_id: box?.id ?? 0,
      ended_on: format(new Date(), 'yyyy-MM-dd'),
    });
  }, []);

  const validate = async(resignValue: ResignActiveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(resignValue.ended_on !== '' || <p>契約終了年月日を入力してください。</p>);

    errors = errors.filter(error => typeof error !== 'boolean');
    if (errors.length == 0) {
      return null;
    } else {
      return {
        title: 'エラー',
        content: errors,
      };
    }
  }

  const { mutateAsync: addMutation } = useResignActiveBoxMutation();

  const commit = async () => {
    const errors = await validate(resignValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      await addMutation(resignValue);

      setModalVisibility(false);
      await message.success('正常に解約しました');
    }
  };

  const labelAlign: FormLabelAlign = 'left';
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    labelAlign: labelAlign,
    colon: false,
  };

  

  return (
    <>
      <Button
        icon={<TagsOutlined />}
        onClick={useCallback(() => setModalVisibility(true), [])}
      >
        解約
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title={box.box_category.code+box.id+"の箱を解約"}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="解約"
      >
        <Form name="resign_active_box">
          <Form.Item
            {...formItemLayout}
            name="ended_on"
            label="解約日"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={moment(resignValue.ended_on, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setResignValue({ ...resignValue, ended_on: e });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ActiveBoxResign;
