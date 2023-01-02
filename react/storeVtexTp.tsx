import React, { useEffect, useState } from 'react'
import { Layout, Spinner, Box } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
import randomCookie from "./graphql/randomCookie.gql"
import { useCssHandles } from "vtex.css-handles"
import { FormattedMessage } from 'react-intl'


const CSS_HANDLES = ["title", "container", "button", "holder", "containerCard"] as const


const storeVtexTp = () => {
    const handles = useCssHandles(CSS_HANDLES)
    // const [idCookieLuck, setIdCookieLuck] = useState(Object)
    const [dataCookie, setDataCookie] = useState("")
    const [queryGet, { data, loading }] = useLazyQuery(randomCookie, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true })
    const [randomLuckNumber, setRandomLuckNumber] = useState("")
    const getRandomCookie = async () => {
        queryGet()

    }
    const newCookieAndNumber = () => {
        setDataCookie(data.randomCookie.text)
        let arrayOfRandomNumbers = Array(4).fill(null).map(() => { return Math.ceil((99 * Math.random())).toString().padStart(2, "0") })
        // let randomNumber: String = (99999999 * Math.random()).toString()
        // randomNumber.padStart(8, "0")
        //[22,44,2,23]
        // nn-nn-nn-nn

        setRandomLuckNumber(arrayOfRandomNumbers.join("-"))


    }
    useEffect(() => {
        data ? newCookieAndNumber() : null
    }, [data])

    return (
        <Layout>
            <div className={` flex flex-column items-center`}>
                <div className='mv5'>

                    <button className={`${handles.button} pa6 `} onClick={getRandomCookie} disabled={loading} ><FormattedMessage id={"admin-example.navigation.single"} /></button>
                </div>

                {data ?
                    <div className={`${handles.container} flex flex-column items-center`}><Box title={dataCookie}> </Box><h5>{randomLuckNumber}</h5></div>
                    : loading ? <div><Spinner color="#960B0B" size={40} /></div>
                        : <div className={handles.holder} ></div>}


            </div>


        </Layout>
    )
}

export default storeVtexTp