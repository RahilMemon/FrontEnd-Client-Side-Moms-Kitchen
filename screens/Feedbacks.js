import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import FeedbackSection from '../components/FeedbackSection'
import AppBar from '../components/AppBar'

const Feedbacks = ({route}) => {

  const { params: { feedbacksData : { feedbacks, ratings, avgRating, reviewsCount, feedbackCount }, stars : { filledStars, emptyStars, hasHalfStar } } } = route

  return (
    <ScrollView className="bg-white min-h-screen">
      <AppBar title="Feedbacks"/>
      <FeedbackSection feedbacksData={{feedbacks, ratings, avgRating, reviewsCount, feedbackCount}} stars={{filledStars, emptyStars, hasHalfStar}} />
    </ScrollView>
  )
}

export default Feedbacks