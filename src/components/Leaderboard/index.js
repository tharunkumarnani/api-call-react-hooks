import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'
import {LeaderboardContainer, LoadingViewContainer} from './styledComponents'
import LeaderboardTable from '../LeaderboardTable'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
const Leaderboard = () => {
  // Your code goes here...
  const [apiResponse, setResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errMsg: null,
  })
  useEffect(() => {
    const getData = async () => {
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      setResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errMsg: null,
      })
      const response = await fetch(url, options)
      const responseData = await response.json()
      const updatedData = responseData.leaderboard_data.map(each => ({
        id: each.id,
        language: each.language,
        name: each.name,
        profileImageUrl: each.profile_image_url,
        rank: each.rank,
        score: each.score,
        timeSpent: each.time_spent,
      }))
      if (response.ok) {
        setResponse({
          status: apiStatusConstants.success,
          data: updatedData,
          errMsg: null,
        })
      } else {
        setResponse({
          status: apiStatusConstants.failure,
          data: null,
          errMsg: 'UnAuthorized Agent',
        })
      }
    }
    getData()
  }, [])
  const renderLeaderboard = () => {
    // Your code goes here...
    const renderLoadingView = () => (
      <LoadingViewContainer>
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </LoadingViewContainer>
    )
    const renderSuccessView = () => {
      const {data} = apiResponse
      return <LeaderboardTable leaderboardData={data} />
    }
    const renderFailureView = () => <h2>UnAuthorized Agent</h2>
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
