import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  ResignReserveBoxParam,
  useResignReserveBoxMutation,
} from '@/services/arrow-manage/artist';
import { UseQueryResult } from 'react-query';
import { Box, useBoxes } from '@/services/arrow-manage/box';
import { format } from 'date-fns';

export type ArtistResignProps = {
  box: Box;
};


const ReserveBoxResign: React.FC<ArtistResignProps> = (props) => {
  const box = props.box;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [resignValue, setResignValue] = useState<ResignReserveBoxParam>({
    reserve_box_id: box.reserve_box?.id ?? 0,
    artist_id: box?.artist?.id ?? 0,
    box_id: box?.id ?? 0,
    ended_on: '',
  });

  const cleanupState = useCallback(() => {
    setResignValue({
      reserve_box_id: box.reserve_box?.id ?? 0,
      artist_id: box?.artist?.id ?? 0,
      box_id: box?.id ?? 0,
      ended_on: '',
    });
  }, []);

  const validate = async(resignValue: ResignReserveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

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

  const { mutateAsync: addMutation } = useResignReserveBoxMutation();

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
        <Form name="resign_reserve_box">
          <Form.Item
            {...formItemLayout}
            name="ended_on"
            label="予約終了日"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={resignValue.ended_on == '' ? undefined : moment(resignValue.ended_on, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setResignValue({ ...resignValue, ended_on: e });
            }}/>
            <p>空白なら予約ごと削除されます。</p>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ReserveBoxResign;
