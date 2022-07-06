import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  AddReserveBoxParam,
  Artist,
  useCreateReserveBoxMutation,
} from '@/services/manager/artist';
import { UseQueryResult } from 'react-query';
import { Box, useBoxes } from '@/services/manager/box';
import { format } from 'date-fns';

export type ArtistAddProps = {
  artist: Artist;
};


const ReserveBoxAdd: React.FC<ArtistAddProps> = (props) => {
  const artist = props.artist;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const { data: data, isLoading } =
    useBoxes() as UseQueryResult<{boxes: Box[], boxes_hash: {[id: number]: Box}}>;
  const _rawBoxes = data?.boxes;
  const boxes_hash = data?.boxes_hash ?? {};
  const rawBoxes = _rawBoxes ?? [];
  const box_options: {label: string, value: string | number, money: number}[] = rawBoxes.map((box: Box) => {
    return {label: box.box_category.code+box.id, value: String(box.id), money: Number(box.money)};
  });
  box_options.push({label: '箱を選択', value: '', money: 0});

  const [addValue, setAddValue] = useState<AddReserveBoxParam>({
    box_id: '',
    artist_id: artist.id,
    started_on: format(new Date(), 'yyyy-MM-dd'),
  });

  const cleanupState = useCallback(() => {
    setAddValue({
      box_id: '',
      artist_id: artist.id,
      started_on: format(new Date(), 'yyyy-MM-dd'),
    });
  }, []);

  const validate = async(addValue: AddReserveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(addValue.box_id !== '' || <p>箱を選択してください。</p>);
    errors.push(addValue.started_on !== '' || <p>予約開始年月日を入力してください。</p>);

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

  const { mutateAsync: addMutation } = useCreateReserveBoxMutation();

  const commit = async () => {
    const errors = await validate(addValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      const res = await addMutation(addValue);
      if (res.result == 'error') {
        error_modal.error({title: 'エラー', content: '追加できませんでした。この箱の契約や予約の期間が被っている可能性があります。'}); 
      } else {
        setModalVisibility(false);
        await message.success('正常に追加しました');
      }
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
        新規に箱を予約
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title="新規に箱を予約"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="実行"
      >
        <Form name="add_reserve_box">
          <Form.Item
            {...formItemLayout}
            name="name"
            label="箱"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select style={{ width: '100%' }} options={box_options} defaultValue={String(addValue.box_id)} onSelect={(e: string | number, option: {label: string, value: string | number, money: number}) => {
              setAddValue({ ...addValue, box_id: e });
            }}></Select>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="started_on"
            label="予約日"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={moment(addValue.started_on, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setAddValue({ ...addValue, started_on: e });
            }}/>
          </Form.Item>
         
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ReserveBoxAdd;
