package com.jolandaverhoef.designsystem.library

import android.support.test.espresso.Espresso.onView
import android.support.test.espresso.action.ViewActions.click
import android.support.test.espresso.matcher.ViewMatchers.withId
import android.support.test.filters.LargeTest
import com.novoda.espresso.ViewTestRule
import org.junit.Assert
import org.junit.Rule
import org.junit.Test

@LargeTest
class ButtonBehaviorTest {

    @Rule
    @JvmField
    val viewTestRule = ViewTestRule<Button>(R.layout.view_button)

    @Test
    fun buttonClick_triggersCallback() {
        var isClicked = false

        viewTestRule.runOnMainSynchronously {
            it.render(active = true)
            it.setOnClickListener { isClicked = true }
        }

        onView(withId(R.id.view_button)).perform(click())

        Assert.assertEquals(true, isClicked)
    }
}
