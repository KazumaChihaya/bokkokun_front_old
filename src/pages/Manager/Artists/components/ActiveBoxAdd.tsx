import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  AddActiveBoxParam,
  Artist,
  useCreateActiveBoxMutation,
} from '@/services/arrow-manage/artist';
import { UseQueryResult } from 'react-query';
import { Box, useBoxes } from '@/services/arrow-manage/box';
import { format } from 'date-fns';

export type ArtistAddProps = {
  artist: Artist;
};


const ActiveBoxAdd: React.FC<ArtistAddProps> = (props) => {
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

  const [addValue, setAddValue] = useState<AddActiveBoxParam>({
    box_id: '',
    artist_id: artist.id,
    started_on: format(new Date(), 'yyyy-MM-dd'),
    money: 0,
  });

  const cleanupState = useCallback(() => {
    setAddValue({
      box_id: '',
      artist_id: artist.id,
      started_on: format(new Date(), 'yyyy-MM-dd'),
      money: 0,
    });
  }, []);

  const validate = async(addValue: AddActiveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(addValue.box_id !== '' || <p>箱を選択してください。</p>);
    errors.push(addValue.started_on !== '' || <p>契約開始年月日を入力してください。</p>);
    errors.push(addValue.money === null || Number.isInteger(addValue.money) || <p>特別価格は半角数字で入力してください。</p>);
    errors.push(addValue.money === null || !Number.isInteger(addValue.money) || addValue.money >= 0 || <p>特別価格は0以上で入力してください。</p>);

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

  const { mutateAsync: addMutation } = useCreateActiveBoxMutation();

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
        新規に箱を契約
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title="新規に箱を契約"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="実行"
      >
        <Form name="add_active_box">
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
            <Select style={{ width: '100%' }} value={String(addValue.box_id)} options={box_options} defaultValue={String(addValue.box_id)} onSelect={(e: string | number, option: {label: string, value: string | number, money: number}) => {
              setAddValue({ ...addValue, box_id: e, money: Number(option.money) });
            }}></Select>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="started_on"
            label="契約日"
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
              addValue.box_id !== '' ? 
              <InputNumber value={addValue.money} min={0} defaultValue={addValue.money} onChange={(e) => {
                setAddValue({ ...addValue, money: Number(e) });
              }}/>
              : <span>箱を選択</span>
            }
            {
              addValue.box_id !== '' ?
              (
                boxes_hash[Number(addValue.box_id)].money != addValue.money ?
                <p>特別料金が設定されました。</p>
                : <></>
              ) : <></>
            }
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ActiveBoxAdd;
