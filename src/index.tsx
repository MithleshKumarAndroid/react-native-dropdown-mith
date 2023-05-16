import React, { FC, useRef, useState } from "react";
import { FlatList, Modal, TextStyle, Text, Image } from "react-native";
import { View, TouchableOpacity, ViewStyle, StyleSheet } from "react-native";
import COLOR from "./util/Color";
import { UpIcon, DownIcon } from "../src/assets";

interface Props {
  containerStyle?: ViewStyle;
  dropDownStyle?: ViewStyle;
  onClick: (item: { id: number; value: string }) => void;
  data?: Array<{ id: number; value: string }>;
  title?: string;
  titleStyle?: TextStyle;
  placeHolder?: string;
  itemTextStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
}

const Custom: FC<Props> = ({
  containerStyle,
  dropDownStyle,
  onClick,
  data,
  title,
  titleStyle,
  placeHolder,
  itemTextStyle,
  selectedTextStyle,
}) => {
  const DropDownButton = useRef(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dropdownTop, setDropdownTop] = useState<number>(0);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");

  const dynamicStyles = styles(
    selected,
    dropdownWidth,
    dropdownTop,
    dropdownLeft
  );

  const click = (item: any): void => {
    onClick(item);
    setShowModal(false);
    setSelected(item.value);
  };

  const renderDropdown = () => {
    return (
      <Modal visible={showModal} transparent animationType="none">
        <TouchableOpacity
          style={dynamicStyles.overLay_Con}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={[dynamicStyles.dropdown, dropDownStyle]}>
            <FlatList
              data={data}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={dynamicStyles.list_Con}
                    onPress={() => click(item)}
                  >
                    <Text style={[dynamicStyles.list_Label, itemTextStyle]}>
                      {item?.value}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const toggleDropdown = (): void => {
    showModal ? setShowModal(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropDownButton?.current?.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number
      ) => {
        setDropdownTop(py + h);
        setDropdownLeft(_px);
        setDropdownWidth(_w);
      }
    );
    setShowModal(true);
  };

  return (
    <>
      {title && <Text style={titleStyle}>{title}</Text>}
      <TouchableOpacity
        ref={DropDownButton}
        onPress={toggleDropdown}
        style={[dynamicStyles.main, containerStyle]}
      >
        <Text
          numberOfLines={3}
          style={[dynamicStyles.title_Lable, selectedTextStyle]}
        >
          {selected ? selected : placeHolder}
        </Text>
        <Image
          style={dynamicStyles.dropDownIcon}
          source={showModal ? UpIcon : DownIcon}
        />
      </TouchableOpacity>
      {renderDropdown()}
    </>
  );
};

const styles = (
  selected: string,
  dropdownWidth: number,
  dropdownTop: number,
  dropdownLeft: number
) =>
  StyleSheet.create({
    main: {
      width: "100%",
      height: 40,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 10,
      borderColor: COLOR.LIGHT_GREY,
      borderWidth: 0.5,
      borderRadius: 5,
    },
    overLay_Con: {
      height: "100%",
      width: "100%",
    },
    label: {
      fontSize: 14,
      color: "#000",
    },
    dropdown: {
      position: "absolute",
      backgroundColor: "#fff",
      shadowColor: "#000000",
      shadowRadius: 4,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.5,
      minHeight: 40,
      justifyContent: "center",
      width: dropdownWidth,
      top: dropdownTop,
      left: dropdownLeft,
      elevation: 7,
      borderRadius: 5,
    },
    list_Con: {
      width: "100%",
      height: 40,
      justifyContent: "center",
      alignItems: "flex-start",
      borderBottomWidth: 0.5,
      borderBottomColor: COLOR.LIGHT_GREY,
      paddingHorizontal: 10,
    },
    title_Lable: {
      color: selected ? COLOR.BLACK : COLOR.LIGHT_GREY,
      opacity: selected ? 0.8 : 1,
      maxWidth: "80%",
      marginVertical: 0,
    },
    list_Label: {
      marginVertical: 0,
      paddingLeft: 5,
    },
    dropDownIcon: {
      width: 20,
      height: 20,
      resizeMode: "contain",
    },
  });
export default Custom;
