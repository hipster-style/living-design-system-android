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
        button_image.setImageResource(
                if(active) android.R.drawable.ic_btn_speak_now
                else android.R.drawable.ic_delete)
        button_text.setTextColor(ContextCompat.getColor(context, R.color.COLOR_TEXT_BUTTON))
        setBackgroundResource(R.drawable.bg_button)
    }
}
