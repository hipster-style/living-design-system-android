package com.jolandaverhoef.designsystem.library

import android.content.Context
import android.support.constraint.ConstraintLayout
import android.support.v4.content.ContextCompat
import android.util.AttributeSet
import android.view.View
import kotlinx.android.synthetic.main.merge_button.view.*

class Button @JvmOverloads constructor(
        context: Context,
        attrs: AttributeSet? = null,
        defStyleAttr: Int = 0
) : ConstraintLayout(context, attrs, defStyleAttr) {

    init {
        View.inflate(context, R.layout.merge_button, this)
        isClickable = true
    }

    fun render(active: Boolean) {
        button_text.setTextColor(ContextCompat.getColor(context, R.color.BLUE_GREY_200))
        setBackgroundResource(
                if(active) R.drawable.bg_button
                else R.drawable.bg_button_inactive)
    }
}
