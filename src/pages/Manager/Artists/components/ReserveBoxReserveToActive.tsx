import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  ReserveToActiveBoxParam,
  ResignReserveBoxParam,
  useReserveToActiveBoxMutation,
  useResignReserveBoxMutation,
} from '@/services/arrow-manage/artist';
import { UseQueryResult } from 'react-query';
import { Box, useBoxes } from '@/services/arrow-manage/box';
import { format } from 'date-fns';

export type ReserveResignToActiveProps = {
  box: Box;
};


const ReserveBoxReserveToActive: React.FC<ReserveResignToActiveProps> = (props) => {
  const box = props.box;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [activeValue, setActiveValue] = useState<ReserveToActiveBoxParam>({
    reserve_box_id: box.reserve_box?.id ?? 0,
    artist_id: box?.artist?.id ?? 0,
    box_id: box?.id ?? 0,
    ended_on: '',
    money: box.money,
  });

  const cleanupState = useCallback(() => {
    setActiveValue({
      reserve_box_id: box.reserve_box?.id ?? 0,
      artist_id: box?.artist?.id ?? 0,
      box_id: box?.id ?? 0,
      ended_on: '',
      money: box.money,
    });
  }, []);

  const validate = async(activeValue: ReserveToActiveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(activeValue.ended_on !== '' || <p>納品年月日を入力してください。</p>);
    errors.push(activeValue.money === null || Number.isInteger(activeValue.money) || <p>特別価格は半角数字で入力してください。</p>);
    errors.push(activeValue.money === null || !Number.isInteger(activeValue.money) || activeValue.money >= 0 || <p>特別価格は0以上で入力してください。</p>);

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

  const { mutateAsync: addMutation } = useReserveToActiveBoxMutation();

  const commit = async () => {
    const errors = await validate(activeValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      await addMutation(activeValue);

      setModalVisibility(false);
      await message.success('正常に予約からアクティブに変更しました');
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
        納品
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title={box.box_category.code+box.id+"の予約箱へ納品"}
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="実行"
      >
        <Form name="resign_reserve_box">
          <Form.Item
            {...formItemLayout}
            name="ended_on"
            label="納品日"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={activeValue.ended_on == '' ? undefined : moment(activeValue.ended_on, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setActiveValue({ ...activeValue, ended_on: e });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="money"
            label="料金"
            rules={[
              {
                required: true,
              },
            ]} 
          >
            {
              <InputNumber value={activeValue.money} min={0} defaultValue={activeValue.money} onChange={(e) => {
                setActiveValue({ ...activeValue, money: Number(e) });
              }}/>
            }
            {
              (
                box.money != activeValue.money ?
                <p>特別料金が設定されました。</p>
                : <></>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ReserveBoxReserveToActive;
