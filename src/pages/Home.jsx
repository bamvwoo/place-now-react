import PlaceList from "../components/Home/PlaceList";
import styled from "styled-components";
import { VerticalWrapper } from "../components/Common/Wrapper";
import { useState } from "react";

const Wrapper = styled(VerticalWrapper)`
    width: 100%;
    height: 100%;
    padding: 20px 0px;
`;

export default function Home() {

    const [ places, setPlaces ] = useState([]);

    return (
        <Wrapper>
            <PlaceList places={ places } setPlaces={ setPlaces } />
        </Wrapper>
    )
}